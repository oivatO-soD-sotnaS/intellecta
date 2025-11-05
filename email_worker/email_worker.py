
import json
import time
import os
from dotenv import load_dotenv
import redis
from concurrent.futures import ThreadPoolExecutor

from email_service import EmailService

load_dotenv()

REDIS_HOST = os.getenv("REDIS_HOST", "redis_container")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
REDIS_QUEUE_NAME = os.getenv("REDIS_QUEUE_NAME", "email_queue")

MAX_WORKERS = int(os.getenv("MAX_WORKERS", 5)) # Number of concurrent email sending threads
POLL_INTERVAL = float(os.getenv("POLL_INTERVAL", 0.2)) # seconds

def process_email_job(email_data):
    mailer = EmailService()
    try:
        to_email = email_data["to"]
        to_name = email_data["toName"]
        subject = email_data["subject"]
        body = email_data["body"]
        alt_body = email_data.get("altBody", "")
        mailer.send_mail(to_email, to_name, subject, body, alt_body)
    except KeyError as e:
        print(f"[✘] Invalid email job format: Missing key {e} in {email_data}")
    except Exception as e:
        print(f"[✘] Error processing email job {email_data}: {e}")

def main():
    print("[*] Python Email Worker started...")
    r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=0)
    executor = ThreadPoolExecutor(max_workers=MAX_WORKERS)

    while True:
        job_json = r.rpop(REDIS_QUEUE_NAME)
        if job_json:
            try:
                email_data = json.loads(job_json)
                executor.submit(process_email_job, email_data)
            except json.JSONDecodeError:
                print(f"[✘] Failed to decode JSON from Redis: {job_json}")
            except Exception as e:
                print(f"[✘] Unexpected error when submitting job: {e}")
        else:
            time.sleep(POLL_INTERVAL)

if __name__ == "__main__":
    main()

