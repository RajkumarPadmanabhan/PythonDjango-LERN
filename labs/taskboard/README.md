# Task board

A small Django 6.1 project used by the Pathline course. Each user sees only their own tasks.

## Run

```powershell
cd labs\taskboard
py -3 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Open http://127.0.0.1:8000/ and log in. The admin is at http://127.0.0.1:8000/admin/.

```powershell
python manage.py test
```

`DJANGO_SECRET_KEY` overrides the development key. Leave `DJANGO_DEBUG` unset (or set it to `1`) on your machine. Set `DJANGO_DEBUG=0` only when you also set a real secret and `ALLOWED_HOSTS`.
