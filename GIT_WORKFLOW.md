# Git Workflow

מסמך זה מגדיר את תהליך העבודה עם Git בצוות: מפתיחת branch ועד מיזוג ל-`main`.

## עקרונות

- `main` הוא ה-branch היציב. לא עובדים ולא עושים push ישירות אליו.
- לכל משימה פותחים branch נפרד.
- כל שינוי נכנס ל-`main` רק דרך Pull Request אחרי Code Review.
- branches ו-PR קטנים וממוקדים במשימה אחת.

## שלבי העבודה

### 1. עדכון `main` לפני התחלה

```bash
git checkout main
git pull origin main
```

### 2. פתיחת branch חדש

```bash
git checkout -b feat/foo-123-bar
```

### 3. עבודה וקומיטים

```bash
git status
git add <file>
git commit -m "feat: add foo component"
```

- מומלץ להוסיף קבצים ספציפיים ולא `git add .`, כדי לא לכלול קבצים לא רצויים (כמו `.env`).
- קומיטים קטנים ותכופים, כל אחד עם מטרה אחת.

### 4. עדכון ה-branch מול `main`

לפני פתיחת PR, וגם בכל פעם ש-`main` התקדם בזמן העבודה:

```bash
git fetch origin
git rebase origin/main
```

אם מתעורר קונפליקט:

1. פותחים את הקבצים המסומנים ופותרים את הקונפליקט ידנית (מסירים את הסימונים `<<<<<<<`, `=======`, `>>>>>>>`).
2. `git add <file>`
3. `git rebase --continue`
4. אם הסתבכתם: `git rebase --abort` וחוזרים למצב שלפני.

> אם ה-branch כבר נדחף, אחרי rebase צריך: `git push --force-with-lease`.
> אסור להשתמש ב-`--force` רגיל, ואסור לעשות force push ל-`main`.
> אם קשה לכם עם rebase, אפשר `git merge origin/main` כחלופה, ולהתייעץ עם הצוות.

### 5. הרצת בדיקות

לפני ה-push מוודאים שהפרויקט רץ והבדיקות עוברות.

### 6. Push ופתיחת Pull Request

```bash
git push -u origin feat/foo-123-bar
```

פותחים PR מול `main` וממלאים את [תבנית ה-PR](.github/pull_request_template.md).

### 7. Code Review

- נדרש אישור (Approve) של חבר צוות אחד לפחות.
- מתקנים הערות בקומיטים חדשים באותו branch ודוחפים שוב.
- משיבים לכל הערה, ומסמנים Resolved אחרי התיקון.

### 8. מיזוג

- ממזגים רק כשיש אישור והבדיקות עוברות.
- שיטת מיזוג: **Squash and merge**, כדי ש-`main` יישאר נקי, קומיט אחד לכל משימה.
- כותרת הקומיט הממוזג תואמת לפורמט הקומיטים שלהלן.

### 9. ניקוי אחרי מיזוג

```bash
git checkout main
git pull origin main
git branch -d feat/foo-123-bar
git push origin --delete feat/foo-123-bar
```

## שמות branches

פורמט: `<type>/<מפתח-משימה>-<תיאור-קצר>`

- באותיות קטנות באנגלית, מילים מופרדות במקף.
- התיאור קצר ומתאר את המשימה.

| Type | שימוש | דוגמה |
| ---- | ----- | ----- |
| `feat` | פיצ'ר חדש | `feat/foo-123-bar` |
| `fix` | תיקון באג | `fix/foo-124-baz` |
| `refactor` | שיפור קוד ללא שינוי התנהגות | `refactor/foo-125-bar` |
| `docs` | תיעוד | `docs/foo-126-readme` |
| `chore` | תחזוקה ותצורה | `chore/foo-127-config` |

## הודעות קומיט

לפי [Conventional Commits](https://www.conventionalcommits.org/).

### פורמט

```
<type>: <תיאור קצר>

<גוף אופציונלי: מה ולמה>
```

### Types

| Type | שימוש |
| ---- | ----- |
| `feat` | פיצ'ר חדש |
| `fix` | תיקון באג |
| `docs` | שינויי תיעוד בלבד |
| `style` | עיצוב קוד (רווחים, נקודה-פסיק) ללא שינוי לוגיקה |
| `refactor` | שינוי קוד ללא פיצ'ר חדש וללא תיקון באג |
| `test` | הוספה או עדכון של בדיקות |
| `chore` | תחזוקה, תצורה, תלויות |

### כללים

- שורה ראשונה עד 72 תווים, באנגלית, בלשון ציווי (`add`, לא `added`), באותיות קטנות, בלי נקודה בסוף.
- הודעה מתארת מה השתנה, לא "תיקון" או "עדכון" סתמיים.
- קומיט אחד = שינוי לוגי אחד.

### דוגמאות

```
feat: add foo list component
fix: handle empty bar value
docs: update setup instructions
refactor: extract baz helper function
test: add tests for foo validation
chore: update dependencies
```

הודעות שאסור לכתוב: `fix`, `update`, `changes`, `asdf`, `wip`.

## סיכום מהיר

```bash
git checkout main && git pull origin main
git checkout -b feat/foo-123-bar
# ... עבודה וקומיטים ...
git fetch origin && git rebase origin/main
git push -u origin feat/foo-123-bar
# פתיחת PR -> Review -> Squash and merge
```
