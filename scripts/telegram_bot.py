"""
Telegram Bot bridge for Google Antigravity Agent
Allows controlling Antigravity directly from your phone via Telegram.
"""

import os
import sys
import subprocess
import asyncio
from pathlib import Path
from dotenv import load_dotenv

# Ensure UTF-8 output on Windows terminal
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Load env variables from root .env.local or .env
WORKSPACE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(WORKSPACE_DIR / ".env.local")
load_dotenv(WORKSPACE_DIR / ".env")

from telegram import Update
from telegram.ext import (
    ApplicationBuilder,
    CommandHandler,
    MessageHandler,
    filters,
    ContextTypes,
)
from google.antigravity import Agent, LocalAgentConfig, CapabilitiesConfig, policy, types

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
ALLOWED_USER_ID = os.getenv("TELEGRAM_ALLOWED_USER_ID")


def get_git_status() -> str:
    try:
        res = subprocess.run(
            ["git", "status", "-s"],
            cwd=str(WORKSPACE_DIR),
            capture_output=True,
            text=True,
            check=True,
        )
        output = res.stdout.strip()
        branch_res = subprocess.run(
            ["git", "branch", "--show-current"],
            cwd=str(WORKSPACE_DIR),
            capture_output=True,
            text=True,
            check=True,
        )
        branch = branch_res.stdout.strip()
        if not output:
            return f"🌿 Branch: `{branch}`\n✅ Working tree bersih (tidak ada perubahan)."
        return f"🌿 Branch: `{branch}`\n📝 File yang berubah:\n```\n{output}\n```"
    except Exception as e:
        return f"❌ Error cek git: {e}"


def auto_git_push(prompt: str) -> str:
    try:
        status = subprocess.run(
            ["git", "status", "-s"],
            cwd=str(WORKSPACE_DIR),
            capture_output=True,
            text=True,
            check=True,
        )
        if not status.stdout.strip():
            return "ℹ️ Tidak ada perubahan kode baru untuk di-push."

        subprocess.run(["git", "add", "."], cwd=str(WORKSPACE_DIR), check=True)
        commit_msg = f"refactor: {prompt[:60]} (via Telegram)"
        subprocess.run(
            ["git", "commit", "-m", commit_msg], cwd=str(WORKSPACE_DIR), check=True
        )
        push_res = subprocess.run(
            ["git", "push", "origin", "main"],
            cwd=str(WORKSPACE_DIR),
            capture_output=True,
            text=True,
            check=True,
        )
        return f"🚀 Berhasil commit & push ke GitHub:\n`{commit_msg}`"
    except Exception as e:
        return f"⚠️ Gagal push otomatis: {e}"


async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_user.id
    welcome_text = (
        f"👋 Halo *{update.effective_user.first_name}*!\n\n"
        f"Bot Antigravity siap menerima prompt kamu.\n\n"
        f"🆔 Telegram ID kamu: `{user_id}`\n\n"
        f"📌 *Perintah yang tersedia:*\n"
        f"• Kirim text apapun: Eksekusi prompt via Antigravity di workspace `{WORKSPACE_DIR}`\n"
        f"• `/status` - Cek git status & branch aktif\n"
        f"• `/push` - Push manual perubahan ke origin main\n"
        f"• `/help` - Tampilkan panduan ini\n"
    )
    if not ALLOWED_USER_ID:
        welcome_text += (
            f"\n⚠️ *Catatan Keamanan:*\n"
            f"Set `TELEGRAM_ALLOWED_USER_ID={user_id}` di `.env.local` agar bot hanya melayani kamu."
        )
    await update.message.reply_text(welcome_text, parse_mode="Markdown")


async def status_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if ALLOWED_USER_ID and str(update.effective_user.id) != str(ALLOWED_USER_ID):
        await update.message.reply_text("⛔ Akses ditolak.")
        return
    status_text = get_git_status()
    await update.message.reply_text(status_text, parse_mode="Markdown")


async def push_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if ALLOWED_USER_ID and str(update.effective_user.id) != str(ALLOWED_USER_ID):
        await update.message.reply_text("⛔ Akses ditolak.")
        return
    msg = await update.message.reply_text("⏳ Mendorong commit ke GitHub...")
    push_result = auto_git_push("manual push command")
    await msg.edit_text(push_result, parse_mode="Markdown")


async def handle_prompt(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_user.id
    if ALLOWED_USER_ID and str(user_id) != str(ALLOWED_USER_ID):
        await update.message.reply_text(
            f"⛔ Akses ditolak. ID `{user_id}` tidak diizinkan.",
            parse_mode="Markdown",
        )
        return

    prompt = update.message.text
    if not prompt or prompt.startswith("/"):
        return

    chat_id = update.effective_chat.id
    status_msg = await update.message.reply_text(
        f"⚙️ *Menerima Instruksi:*\n> {prompt}\n\n⏳ *Antigravity sedang mengeksekusi...*",
        parse_mode="Markdown",
    )

    system_instructions = (
        f"You are Antigravity, an expert AI coding agent operating in workspace {WORKSPACE_DIR}. "
        "Solve the user request thoroughly, make direct modifications to files if needed, "
        "and follow project conventions. Keep output concise."
    )

    model_name = os.getenv("ANTIGRAVITY_MODEL", "gemini-3.5-flash")

    config = LocalAgentConfig(
        model=model_name,
        system_instructions=system_instructions,
        capabilities=CapabilitiesConfig(),
        policies=[policy.allow_all()],
        workspaces=[str(WORKSPACE_DIR)],
    )

    # Background task to send typing indicator every 4 seconds
    stop_typing = asyncio.Event()

    async def keep_typing():
        while not stop_typing.is_set():
            try:
                await context.bot.send_chat_action(chat_id=chat_id, action="typing")
            except Exception:
                pass
            try:
                await asyncio.wait_for(stop_typing.wait(), timeout=4.0)
            except asyncio.TimeoutError:
                pass

    typing_task = asyncio.create_task(keep_typing())

    async def execute_task():
        full_reply = ""
        last_tool = None
        async with Agent(config) as agent:
            response = await agent.chat(prompt)
            async for chunk in response.chunks:
                if isinstance(chunk, types.ToolCall):
                    tool_name = getattr(chunk, "name", "tool")
                    if tool_name != last_tool:
                        last_tool = tool_name
                        try:
                            await status_msg.edit_text(
                                f"⚙️ *Menerima Instruksi:*\n> {prompt}\n\n"
                                f"🛠️ *Menjalankan aksi:* `{tool_name}`...\n"
                                f"⏳ Sedang membaca/memodifikasi kode...",
                                parse_mode="Markdown",
                            )
                        except Exception:
                            pass
                elif isinstance(chunk, types.Text):
                    full_reply += chunk.text

        if not full_reply.strip():
            # Fallback if text chunks were not yielded
            full_reply = await response.text()

        return full_reply

    try:
        # Limit agent run to 120s to prevent infinite stalls
        full_reply = await asyncio.wait_for(execute_task(), timeout=120.0)

        # Potong dan kirim respon (limit telegram 4000 char per pesan)
        reply_header = "✅ *Eksekusi Antigravity Selesai:*\n\n"
        chunks = [
            full_reply[i : i + 3800]
            for i in range(0, max(1, len(full_reply)), 3800)
        ]

        if not chunks or not full_reply.strip():
            await status_msg.edit_text("✅ Instruksi selesai dijalankan.")
        else:
            await status_msg.edit_text(reply_header + chunks[0])
            for next_chunk in chunks[1:]:
                await update.message.reply_text(next_chunk)

        # Otomatis push jika ada perubahan file (sesuai instruksi user)
        push_status = auto_git_push(prompt)
        await update.message.reply_text(push_status, parse_mode="Markdown")

    except asyncio.TimeoutError:
        await status_msg.edit_text(
            "⏱️ *Batas waktu eksekusi terlewati (Timeout 120s).*\n"
            "Perintah mungkin terlalu kompleks atau terkena rate limit API.\n"
            "Silakan coba persempit instruksi.",
            parse_mode="Markdown",
        )
    except Exception as e:
        err_str = str(e)
        if "429" in err_str or "RESOURCE_EXHAUSTED" in err_str:
            error_msg = (
                "⚠️ *Google Gemini API Rate Limit (Quota Exceeded - 429)*\n\n"
                "Akun Free Tier Gemini memiliki kuota terbatas per menit. "
                "Tunggu ~1 menit sebelum mengirim prompt berikutnya, atau upgrade ke Pay-as-you-go di Google AI Studio."
            )
        else:
            error_msg = f"❌ Terjadi kesalahan saat eksekusi:\n```\n{err_str[:800]}\n```"
        await status_msg.edit_text(error_msg, parse_mode="Markdown")
    finally:
        stop_typing.set()
        typing_task.cancel()


def main():
    token = BOT_TOKEN
    if not token:
        print("=" * 60)
        print("⚠️  TELEGRAM_BOT_TOKEN belum diset di .env atau .env.local!")
        print("Silakan masukkan token bot Telegram Anda:")
        token = input("Telegram Bot Token: ").strip()
        print("=" * 60)

    if not token:
        print("❌ Token tidak boleh kosong. Jalankan ulang script.")
        sys.exit(1)

    print("🚀 Menginisialisasi Bot Telegram Antigravity...")
    app = ApplicationBuilder().token(token).build()

    app.add_handler(CommandHandler("start", start_command))
    app.add_handler(CommandHandler("help", start_command))
    app.add_handler(CommandHandler("status", status_command))
    app.add_handler(CommandHandler("push", push_command))
    app.add_handler(MessageHandler(filters.TEXT & (~filters.COMMAND), handle_prompt))

    print("🤖 Bot Telegram Antigravity AKTIF!")
    print(f"📁 Workspace: {WORKSPACE_DIR}")
    print("Silakan buka Telegram kamu dan mulai chat / kirim prompt.")
    print("Tekan Ctrl+C untuk menghentikan bot.\n")

    app.run_polling()


if __name__ == "__main__":
    main()
