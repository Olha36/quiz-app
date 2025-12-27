# 🎓 Quiz App

[![Vercel](https://img.shields.io/badge/deployed%20on-vercel-black?logo=vercel)](https://quiz-app-two-beta-19.vercel.app/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Contentful](https://img.shields.io/badge/Contentful-000000?logo=contentful&logoColor=white)](https://www.contentful.com/)
[![Algolia](https://img.shields.io/badge/Algolia-5468FF?logo=algolia&logoColor=white)](https://www.algolia.com/)

A **Next.js quiz application** written in **TypeScript** using **Contentful** as CMS and **Algolia** to save results. The app provides interactive quizzes with:

- **Progress bar** to track user progress.
- **Results evaluation** with percentage analysis.
- **Chart visualization** of results.
- **Deployed on Vercel**: [Live Demo](https://quiz-app-two-beta-19.vercel.app/)

---

## 🛠 Features

- Fetch quiz questions and answer choices dynamically from Contentful.
- Track user progress through a visual progress bar.
- Evaluate quiz answers upon completion.
- Display results as:
  - Percentage of correct answers.
  - Detailed chart analysis.
- Save results to Algolia for analytics or leaderboard.
- Fully responsive and mobile-friendly.

---

## 🚀 Live Demo

Check the deployed app here: [https://quiz-app-two-beta-19.vercel.app/](https://quiz-app-two-beta-19.vercel.app/)

---

## 💻 Tech Stack

- **Framework:** Next.js
- **Language:** TypeScript
- **CMS:** Contentful (Headless CMS)
- **Database / Search:** Algolia
- **Charts:** [Chart.js](https://www.chartjs.org/) (for results visualization)
- **Deployment:** Vercel

---

📝 Usage

## Navigate through the quiz and select answers.

- The progress bar updates as you answer each question.

- Once finished, your answers are processed:

- A summary of correct/incorrect answers.

- A percentage of correct answers.

- A visual chart showing your performance.

- Results are stored in Algolia, making it easy to track analytics or generate leaderboards.


🔗 Contentful Integration

- Quiz questions are fetched from Contentful via their Content Delivery API.

- Questions are dynamically displayed in the quiz.

- Steps are sorted by stepOrder field in Contentful.

📊 Algolia Integration

- Quiz results are saved to Algolia.




## ⚡ Installation & Setup

1. **Clone the repository:**

```bash
git clone https://github.com/yourusername/quiz-app.git
cd quiz-app

2. **Install dependencies:**
npm install
# or
yarn install


3. **Create .env.local file in the root folder:**
NEXT_PUBLIC_ALGOLIA_APP_ID=E7WGVJ548V
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=4a0ef72103507017ceeba4e2e1725af4
ALGOLIA_WRITE_API_KEY=6daadcbac1171cda1ec6381525694849
ALGOLIA_INDEX_NAME=quiz_results

4. **Run the development server:**
npm run dev
# or
yarn dev

All rights reverved 2025
