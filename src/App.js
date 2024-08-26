import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import CreateQuiz from "./components/CreateQuiz/CreateQuiz";
import Home from "./pages/Home/Home";
import LiveQuiz from "./components/LiveQuiz/LiveQuiz";
import QuizAnalysis from "./components/QuizAnalysis/QuizAnalysis";
import DashboardPage from "./pages/Dashboard page/DashboardPage";
import { Toaster } from "react-hot-toast";

export const server = "https://quizee-server.vercel.app/";
// export const server = "http://localhost:8000/";

const handleShareQuiz = (quizId) => {
	// const quizLink = `http://localhost:3000/livequiz/${quizId}`;
	const quizLink = `https://quizee-builder.vercel.app/livequiz/${quizId}`;
	navigator.clipboard
		.writeText(quizLink)
		.then(() => {
			console.log("Quiz link copied to clipboard:", quizLink);
		})
		.catch((error) => {
			console.error("Failed to copy quiz link:", error);
		});
};

function App() {
	return (
		<>
			<Router>
				<Toaster
					position="top-center"
					toastOptions={{ duration: 2000 }}
				/>
				<Routes>
					<Route
						path="/:display?"
						element={<Home />}
					/>
					<Route
						path="/dashboard-page"
						element={<DashboardPage />}
					/>
					<Route
						path="/dashboard"
						element={<Dashboard />}
					/>
					<Route
						path="/create-quiz"
						element={<CreateQuiz handleShareQuiz={handleShareQuiz} />}
					/>
					<Route
						path="/livequiz/:quizId"
						element={<LiveQuiz />}
					/>
					<Route
						path="/quizanalysis"
						element={<QuizAnalysis />}
					/>
				</Routes>
			</Router>
		</>
	);
}

export default App;
