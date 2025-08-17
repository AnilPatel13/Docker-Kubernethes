import os
import time
import redis
from flask import Flask

app = Flask(__name__)

REDIS_HOST = os.environ.get("REDIS_HOST", "redis")   # docker-compose service name
REDIS_PORT = int(os.environ.get("REDIS_PORT", "6379"))

cache = redis.Redis(
    host=REDIS_HOST,
    port=REDIS_PORT,
    db=0,
    socket_connect_timeout=2,
    socket_timeout=2,
)

def get_hit_count():
    retries = 5
    while True:
        try:
            return cache.incr("hits")
        except redis.exceptions.ConnectionError as exc:
            if retries == 0:
                raise exc
            retries -= 1
            time.sleep(0.5)

@app.route("/")
def hello():
    hits = get_hit_count()
    return f"Hello Anil! I've been seen {hits} times.\n"

if __name__ == "__main__":
    # Lets you also run `python app.py` outside Docker if you want
    app.run(host="0.0.0.0", port=5000)
