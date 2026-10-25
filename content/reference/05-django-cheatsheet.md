---
id: django-cheatsheet
track: reference
level: Reference
module: Django reference
title: Django cheatsheet
minutes: 25
keywords: lookup, template tag, filter, manage.py, field, HTTP
summary: Lookups, template tags and filters, management commands, and the request attributes, in one place.
---

## ORM lookups

`exact` (the default), `iexact`, `contains`, `icontains`, `in`, `gt`, `gte`, `lt`, `lte`, `startswith`, `istartswith`, `endswith`, `iendswith`, `range`, `isnull`, `regex`, `iregex`.

Dates: `date`, `year`, `month`, `day`, `week`, `week_day`, `iso_week_day`, `quarter`, `time`, `hour`, `minute`, `second`.

JSON: key transforms (`data__status`), `has_key`, `has_keys`, `has_any_keys`, `contains`, `contained_by`.

Relations: span them with `__` (`owner__username`). `pk` is whatever the primary key is.

## Template tags

Built in: `autoescape`, `block`, `comment`, `csrf_token`, `cycle`, `debug`, `extends`, `filter`, `firstof`, `for`, `if`, `ifchanged`, `include`, `load`, `lorem`, `now`, `querystring`, `regroup`, `resetcycle`, `spaceless`, `templatetag`, `url`, `verbatim`, `widthratio`, `with`.

Django 6: `partialdef`, `partial`. Django 6.1: `csp_nonce_attr`.

From `static`: `static`. From i18n: `translate`, `blocktranslate`, `language`, `get_current_language`, `get_available_languages`. Load those libraries first.

`forloop.counter`, `forloop.counter0`, `forloop.revcounter`, `forloop.first`, `forloop.last`, `forloop.parentloop`, and Django 6's `forloop.length`.

## Template filters

`add`, `addslashes`, `capfirst`, `center`, `cut`, `date`, `default`, `default_if_none`, `dictsort`, `dictsortreversed`, `divisibleby`, `escape`, `escapejs`, `filesizeformat`, `first`, `floatformat`, `force_escape`, `get_digit`, `iriencode`, `join`, `json_script`, `last`, `length`, `linebreaks`, `linebreaksbr`, `linenumbers`, `ljust`, `lower`, `make_list`, `phone2numeric`, `pluralize`, `pprint`, `random`, `rjust`, `safe`, `safeseq`, `slice`, `slugify`, `stringformat`, `striptags`, `time`, `timesince`, `timeuntil`, `title`, `truncatechars`, `truncatechars_html`, `truncatewords`, `truncatewords_html`, `unordered_list`, `upper`, `urlencode`, `urlize`, `urlizetrunc`, `wordcount`, `wordwrap`, `yesno`.

`length_is` was removed. Compare `length` yourself.

## manage.py commands you will run

`startproject`, `startapp`, `runserver`, `makemigrations`, `migrate`, `showmigrations`, `sqlmigrate`, `squashmigrations`, `shell`, `dbshell`, `createsuperuser`, `changepassword`, `check`, `check --deploy`, `test`, `collectstatic`, `makemessages`, `compilemessages`, `flush` (destroys data), `dumpdata`, `loaddata`, `diffsettings`, `sendtestemail`, `optimizemigration`.

`shell` on Django 6 imports common utilities such as `settings` for you. You still import your models.

## Request and response

Request: `method`, `path`, `GET`, `POST`, `FILES`, `COOKIES`, `headers`, `META`, `user`, `session`, `body` (raw bytes; do not also read `POST` carelessly after consuming the body).

Shortcuts: `render`, `redirect`, `get_object_or_404`, `get_list_or_404`, `resolve_url`.

## Auth helpers

`authenticate`, `login`, `logout`, `login_required`, `permission_required`, `user_passes_test`, `get_user_model`, `update_session_auth_hash` after a password change so the current user is not logged out.

## Commands that destroy data

`flush` and `migrate` backward and deleting `db.sqlite3` are irreversible on that database. Know which database `DATABASES` points at before you run them.

:::tip
When you forget a lookup, open this page and the queryset lesson rather than string-building SQL. The double underscore is the API.
:::
