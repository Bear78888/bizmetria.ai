# HANDYALLIANCE — CURRENT STATE AUDIT (Этап 0)

**Дата:** 2026-08-04
**Автор:** AI-разработчик (Claude Code, сессия Этапа 0)
**Статус:** черновик для утверждения владельцем
**Основание:** `docs/handyalliance/MASTER_SPEC.md` (v2.1), разделы §00.1b, §35 «Этап 0»

> Расположение: этот документ и копия мастер-ТЗ временно закоммичены в `Bear78888/bizmetria.ai` (ветка `claude/new-session-u67rv4`), потому что текущая сессия имеет право записи только в этот репозиторий. Канонический дом обоих файлов — репозиторий платформы `Bear78888/cloudbiz` (`docs/MASTER_SPEC.md`, `docs/HANDYALLIANCE_CURRENT_STATE_AUDIT.md`); перенести при первой сессии с правом записи туда.

---

## 1. Итог в трёх предложениях

1. Репозиторий платформы уже существует: **`Bear78888/cloudbiz`** («временное имя, позже — `handyalliance-platform`», по README) — в `main` только README, а в draft PR #1 (`claude/public-site-design`) параллельная сессия строит двуязычный публичный сайт по §7.
2. Отдельных репозиториев CallBrixa / RefundMyLead / старого HandyAlliance в аккаунте `Bear78888` **нет** — из кода доступна только BizMetria; наработки CallBrixa живут на платформе **Retell AI** (подтверждено владельцем 2026-08-04), материалы RefundMyLead — вне GitHub (сайт, шаблоны, Boss Sheet).
3. BizMetria даёт готовые, проверенные паттерны почти для всего фундамента Этапа 1: Supabase (клиенты/миграции/RLS), Stripe Checkout + webhook, Resend, i18n en/es с контролем ключей, AI-пайплайн со structured output и Retell-интеграцию (agent provisioning + webhook) — детальная карта в §4.

## 2. Инвентарь репозиториев и активов

| Актив | Состояние на 2026-08-04 | Вывод для проекта |
|---|---|---|
| `Bear78888/cloudbiz` | Репозиторий платформы HandyAlliance. `main` = README + .gitignore (1 коммит). Ветка `claude/public-site-design` + draft PR #1: Next.js App Router, `[locale]`-роутинг, словари `src/lib/i18n/en.ts`/`es.ts`, `pricing.ts`, `routes.ts`, страницы §7 | Строить платформу здесь. Backend не начат («pending owner access») |
| `Bear78888/bizmetria.ai` | Живой продукт (assessment-платформа), активный `main`, CI, тесты, Supabase-миграции | Источник паттернов (§4). В платформу не сливать — только переиспользование кода |
| CallBrixa | Отдельного репозитория НЕТ. Голосовой агент работает на **Retell AI**; демо-номер 213-816-5979; сайт callbrixa.com | Запросить доступ к дашборду Retell (аккаунт, API key, номера, webhook secret). Паттерн интеграции Retell уже есть в BizMetria |
| RefundMyLead | Отдельного репозитория НЕТ. Материалы: refundmylead.com, шаблоны dispute-писем, SEO-семантика, креативы, Meta Pixel | Запросить экспорт материалов у владельца (файлы/доступы) |
| Handyman Boss Sheet | `Handyman_Boss_Sheet_EN-1.xlsx` + `HANDYMAN_BOSS_APP_TZ.md` — в репозиториях не найдены | Запросить файлы у владельца (прототип Job Tracker §13) |
| Старый лендинг HandyAlliance | `handyalliance.html`, Supabase-таблица `area_claims` — в доступных репозиториях не найдены | Только не задеть при деплое домена; бизнес-логика упразднена |

## 3. Текущее состояние платформы (cloudbiz)

- **Есть:** каркас публичного сайта (draft PR #1) — все основные маршруты §7.1 в обеих локалях, header/footer, карточки инструментов, pricing из конфига, sitemap/robots, typecheck-контроль паритета EN/ES-ключей.
- **Нет:** auth, организаций, кабинета, Supabase-проекта, Stripe, entitlements, всех шести инструментов, Google Sheets sync, admin, юридических страниц (черновики §32), аналитики.
- **Вывод:** стратегия §00.4 («платформа сначала») соблюдается; следующий шаг после мерджа PR #1 — Этап 1 (платформенный фундамент) в cloudbiz.

## 4. Карта переиспользования кода BizMetria → HandyAlliance

<!-- Заполняется по результатам детального аудита кода (см. ниже, добавляется в этой же сессии) -->

## 5. Риски

1. **Параллельные сессии.** В cloudbiz уже работает другая сессия (PR #1). Правило: одна задача — одна ветка — один draft PR; перед началом каждой сессии сверять открытые ветки/PR, чтобы не дублировать работу.
2. **Право записи.** Текущая сессия может пушить только в `bizmetria.ai`. Канонические документы проекта нужно перенести в cloudbiz отдельной задачей.
3. **Нет доступа к внешним сервисам.** Supabase-проект платформы, Stripe, Retell, Resend (домен handyalliance.com), Google Cloud, SMS-провайдер, Vercel, DNS — всё ждёт выдачи доступов (§00.3). Этап 1 можно начинать по коду (schema, RLS, UI, entitlements-логика), но end-to-end проверки заблокированы до выдачи.
4. **BizMetria — однопользовательская модель.** Прямой перенос кода невозможен там, где нет мультитенантности (organizations + RLS по membership §26.1); переносим паттерны, не файлы.
5. **Материалы вне GitHub.** Boss Sheet, шаблоны RefundMyLead, скрипты CallBrixa — единственные источники доменного контента; без них контент-пакет §00.2 будет написан «с нуля» и потребует больше правок владельца.

## 6. Migration plan (после утверждения аудита)

1. Перенести `docs/MASTER_SPEC.md` и этот аудит в `cloudbiz` (первая сессия с правом записи туда).
2. Завершить и смерджить PR #1 (публичный сайт) — с разрешения владельца.
3. Этап 1 в cloudbiz: Supabase-проект платформы, organizations/memberships/business_profiles (§25.1), Auth (email+password, magic link, Google), i18n-инфраструктура в полном объёме §9, entitlements + Stripe foundation, audit log, admin foundation. Паттерны — из BizMetria (§4).
4. Далее по §35: Этап 2 (Job Tracker) → Этап 3 (Google Sheets Sync) → Этап 4 (Estimate Maker) → Этап 5 (Business Website) — публичный первый запуск §36.1 → Этапы 6–8 за feature-флагами → Этап 9 → Этап 11 (Этап 10 пропущен).
5. Retell: аудит существующих агентов CallBrixa в дашборде Retell (сценарии, номера, конфигурация) — отдельной задачей после выдачи доступа; адаптер строить по образцу BizMetria (§4).

## 7. Чек-лист доступов для владельца (§00.3)

Статус на 2026-08-04:

| Ресурс | Статус | Что нужно от владельца |
|---|---|---|
| GitHub | ✅ Частично | `cloudbiz` найден и принят как репо платформы. Подтвердить это решение; выдать сессиям право push в `cloudbiz` |
| Vercel | ❌ | Инвайт; право создать проект для cloudbiz и привязать handyalliance.com; Preview Deployments |
| Домен | ❌ | Подтверждение владения handyalliance.com; доступ к DNS (записи Vercel + Resend) |
| Supabase | ❌ | Создать/выдать проект-базу платформы (отдельный от BizMetria!); Project URL; service role key — только в env Vercel |
| Stripe | ❌ | Инвайт или restricted key (Products/Prices/Webhooks); test и live раздельно |
| Google Cloud | ❌ | Проект со включёнными Sheets API + Drive API; OAuth Client ID/Secret; scope `drive.file`; Google Picker key. Напоминание: верификацию OAuth consent screen запускает владелец (параллельно с Этапом 3) |
| Resend | ❌ | API key; подтвердить sender-домен handyalliance.com |
| SMS | ❌ | Название провайдера, ключи, номер верифицированного A2P-аккаунта |
| Voice (Retell) | 🔶 Платформа известна | Доступ к аккаунту Retell (дашборд/API key), webhook secret, список номеров и существующих агентов CallBrixa |
| Аналитика | ❌ | GA4 property + Search Console для handyalliance.com |
| Файлы | ❌ | `Handyman_Boss_Sheet_EN-1.xlsx`, `HANDYMAN_BOSS_APP_TZ.md`, шаблоны/тексты RefundMyLead, скрипты CallBrixa (если есть вне Retell) |
