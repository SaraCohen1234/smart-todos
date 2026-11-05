// ==========================================
// Kanban Board Logic (SMT-29)
// ==========================================

// נתוני דמה למשימות (כוללים ציון, תגית, תאריך יעד וסטטוס)
const mockTasks = [
    {
        id: 1,
        title: "אפיון ממשק משתמש למערכת החדשה",
        score: 95,
        tag: "דחוף מאוד",
        tagType: "warning",
        dueDate: "היום",
        duration: "60 דקות",
        status: "todo"
    },
    {
        id: 2,
        title: "תיקון באגים בטופס ההרשמה",
        score: 88,
        tag: "באג קריטי",
        tagType: "warning",
        dueDate: "מחר",
        duration: "45 דקות",
        status: "todo"
    },
    {
        id: 3,
        title: "כתיבת בדיקות יחידה לקומפוננטת כרטיס",
        score: 72,
        tag: "איכות קוד",
        tagType: "primary",
        dueDate: "השבוע",
        duration: "90 דקות",
        status: "todo"
    },
    {
        id: 4,
        title: "עדכון תיעוד ה-API ב-GitHub",
        score: 65,
        tag: "תיעוד",
        tagType: "primary",
        dueDate: "השבוע",
        duration: "30 דקות",
        status: "in-progress"
    },
    {
        id: 5,
        title: "הגדרת סביבת עבודה לצוות",
        score: 90,
        tag: "תשתיות",
        tagType: "primary",
        dueDate: "בוצע אתמול",
        duration: "120 דקות",
        status: "done"
    }
];

document.addEventListener("DOMContentLoaded", () => {
    renderKanbanBoard();
});

function renderKanbanBoard() {
    // איפוס העמודות
    const columns = {
        todo: document.getElementById("column-todo"),
        "in-progress": document.getElementById("column-in-progress"),
        done: document.getElementById("column-done")
    };

    const counts = {
        todo: document.getElementById("count-todo"),
        "in-progress": document.getElementById("count-in-progress"),
        done: document.getElementById("count-done")
    };

    // ניקוי תוכן קיים
    Object.values(columns).forEach(col => col.innerHTML = "");

    // מיון המשימות לפי ציון (מהגבוה לנמוך)
    const sortedTasks = [...mockTasks].sort((a, b) => b.score - a.score);

    // מונים לכל עמודה
    const tally = { todo: 0, "in-progress": 0, done: 0 };

    sortedTasks.forEach(task => {
        tally[task.status]++;
        const cardElement = createTaskCard(task);
        columns[task.status].appendChild(cardElement);
    });

    // עדכון המונים במסך
    Object.keys(counts).forEach(status => {
        counts[status].textContent = tally[status];
    });
}

function createTaskCard(task) {
    const article = document.createElement("article");
    const isCompleted = task.status === "done";
    
    article.className = `kanban-card ${isCompleted ? "completed" : ""}`;
    article.setAttribute("draggable", "true");
    article.dataset.id = task.id;

    article.innerHTML = `
        <div class="card-top">
            <div class="card-leading">
                <input class="card-checkbox" type="checkbox" ${isCompleted ? "checked" : ""} aria-label="סמן משימה כהושלמה">
                <button class="card-menu" type="button" aria-label="אפשרויות למשימה">⋯</button>
            </div>
            <span class="card-score">${task.score}</span>
        </div>
        <h3>${task.title}</h3>
        <div class="card-tags">
            <span class="card-tag ${task.tagType}">${task.tag}</span>
        </div>
        <div class="card-meta">
            <span>◷ מועד יעד: ${task.dueDate}</span>
            <span>◴ ${task.duration}</span>
        </div>
    `;

    // הוספת האזנה לשינוי סטטוס דרך התיבה המסומנת
    const checkbox = article.querySelector(".card-checkbox");
    checkbox.addEventListener("change", (e) => {
        if (e.target.checked) {
            task.status = "done";
        } else {
            task.status = "todo";
        }
        renderKanbanBoard(); // רענון הלוח והמיון מחדש
    });

    return article;
}