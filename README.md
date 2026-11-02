# Smart Todos

אפליקציה חכמה לניהול משימות.

## תוכן עניינים

- [מטרת הפרויקט](#מטרת-הפרויקט)
- [פיצ'רים](#פיצרים)
- [טכנולוגיות](#טכנולוגיות)
- [מבנה הפרויקט](#מבנה-הפרויקט)
- [הורדה והרצת הפרויקט](#הורדה-והרצת-הפרויקט)
- [עבודה בצוות](#עבודה-בצוות)
- [תבנית Pull Request](#תבנית-pull-request)

## מטרת הפרויקט

<!-- TODO: להשלים לפי האפיון: מי המשתמשים, איזו בעיה המערכת פותרת. -->

## פיצ'רים

<!-- TODO: להשלים לפי האפיון (Jira) והעיצוב (Figma). -->

- [ ] פיצ'ר foo
- [ ] פיצ'ר bar
- [ ] פיצ'ר baz

## טכנולוגיות

<!-- TODO: לעדכן לפי הבחירה הסופית של הצוות. -->

| תחום | טכנולוגיה |
| ---- | --------- |
| Client | HTML (נקודת כניסה: `index.html`) |
| ניהול חבילות | npm |
| בקרת גרסאות | Git |

## מבנה הפרויקט

```
smart-todos/
├── .github/
│   └── pull_request_template.md   # תבנית ל-PR
├── CLAUDE.md                      # הנחיות לעבודה עם Claude Code
├── GIT_WORKFLOW.md                # כללי עבודה עם Git
├── README.md
└── index.html                     # נקודת הכניסה
```

## הורדה והרצת הפרויקט

```bash
git clone <repository-url>
cd smart-todos
npm install
```

משתני סביבה נשמרים בקובץ `.env` ואינם נכללים בקומיט. לעולם אין לשתף ערכים מהקובץ.

## עבודה בצוות

פירוט מלא ב-[GIT_WORKFLOW.md](GIT_WORKFLOW.md). עיקרי הכללים:

1. לא עובדים ישירות על `main`. לכל משימה פותחים branch חדש.
2. שם branch: `<type>/<מפתח-משימה>-<תיאור-קצר>`, לדוגמה `feat/foo-123-bar`.
3. הודעות קומיט לפי [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`.
4. כל שינוי נכנס ל-`main` רק דרך Pull Request, אחרי Code Review של חבר צוות אחד לפחות.
5. PR קטן וממוקד במשימה אחת.

## תבנית Pull Request

בעת פתיחת PR, התבנית ב-[.github/pull_request_template.md](.github/pull_request_template.md) נטענת אוטומטית. יש למלא את כל הסעיפים ולסמן את רשימת הבדיקה לפני בקשת Review.
