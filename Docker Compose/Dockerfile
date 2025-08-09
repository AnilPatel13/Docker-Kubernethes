FROM python:3.8-alpine
LABEL authors="anil"

WORKDIR /code
COPY requirements.txt /code/requirements.txt

# Faster/leaner pip install
RUN pip install --no-cache-dir -r requirements.txt

COPY . /code

ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

EXPOSE 5000
CMD ["flask", "run"]