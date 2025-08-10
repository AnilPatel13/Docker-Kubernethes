FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
# We'll bind-mount the code/templates at runtime, so no COPY app here.
ENV FLASK_APP=app.py FLASK_RUN_HOST=0.0.0.0 FLASK_DEBUG=1
EXPOSE 5000
CMD ["flask", "run", "--port", "5000"]