import React, { useState, useEffect, useRef } from "react";
import "./HomeSections.css";
import FeatureStrip from "./FeatureStrip";
// import TrackingCard from "./TrackingCard";
import AudioNewsCard from "./AudioNewsCard";

/* ================= QUIZ ================= */
function Quiz({ setPoints }) {
  const questionBank = [
    {
      q: "Which country issued the first postage stamp?",
      options: ["India", "UK", "USA", "France"],
      answer: "UK",
    },
    {
      q: "What is stamp collecting called?",
      options: ["Numismatics", "Philately", "Cartography", "Archaeology"],
      answer: "Philately",
    },
    {
      q: "Which was the first stamp of India?",
      options: ["Scinde Dawk", "Penny Black", "Blue Mauritius", "Red Penny"],
      answer: "Scinde Dawk",
    },
    {
      q: "Which stamp is famous for upside-down airplane printing?",
      options: ["Inverted Jenny", "Penny Black", "Scinde Dawk", "One Anna"],
      answer: "Inverted Jenny",
    },
    {
      q: "A stamp without postal use is called?",
      options: ["Cancelled", "Mint", "Used", "Damaged"],
      answer: "Mint",
    },
  ];

  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const shuffled = [...questionBank].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
  }, []);

  const handleAnswer = (opt) => {
    if (opt === questions[index].answer) {
      setPoints((p) => p + 50);
    }

    const nextIndex = index + 1;

    if (nextIndex >= questions.length) {
      const reshuffled = [...questionBank].sort(() => Math.random() - 0.5);
      setQuestions(reshuffled);
      setIndex(0);
    } else {
      setIndex(nextIndex);
    }
  };

  if (!questions.length) return null;

  return (
    <div className="game-card premium-card">
      <h3>🎯 Daily Stamp Quiz</h3>
      <p>{questions[index].q}</p>

      {questions[index].options.map((opt) => (
        <button key={opt} onClick={() => handleAnswer(opt)}>
          {opt}
        </button>
      ))}
    </div>
  );
}

/* ================= RUNNER GAME ================= */
function RunnerGame({ setPoints }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const jumpRef = useRef(() => {});
  const scoreRef = useRef(0);

  const [best, setBest] = useState(
    parseInt(localStorage.getItem("bestRun")) || 0
  );

  const [gameStarted, setGameStarted] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [restartKey, setRestartKey] = useState(0);

  useEffect(() => {
    if (!gameStarted || gamePaused) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let player = {
      x: 60,
      y: 200,
      dy: 0,
      gravity: 0.7,
      jump: -13,
      grounded: true,
    };

    let hurdles = [];
    let stamps = [];
    let frame = 0;
    let speed = 3;
    let running = true;

    scoreRef.current = 0;
    setScore(0);
    setGameOver(false);

    const jump = () => {
      if (player.grounded && running) {
        player.dy = player.jump;
        player.grounded = false;
      }
    };

    jumpRef.current = jump;

    const handleKey = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener("keydown", handleKey);

    function drawGround() {
      ctx.fillStyle = "#3b2400";
      ctx.fillRect(0, 210, canvas.width, 40);
    }

    function loop() {
      if (!running || gamePaused) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // sky
      ctx.fillStyle = "#021a40";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawGround();

      // gradual difficulty
      if (frame % 300 === 0) speed += 0.2;

      // player movement
      player.y += player.dy;
      player.dy += player.gravity;

      if (player.y >= 200) {
        player.y = 200;
        player.dy = 0;
        player.grounded = true;
      }

      ctx.font = "32px Arial";
      ctx.fillText("🏃", player.x, player.y);

      // red hurdles
      if (frame % 140 === 0) {
        hurdles.push({ x: canvas.width, y: 185, w: 25, h: 25 });
      }

      hurdles = hurdles.filter((h) => h.x > -50);

      for (let h of hurdles) {
        h.x -= speed;
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(h.x, h.y, h.w, h.h);

       const playerBox = {
  x: player.x,
  y: player.y - 28,
  w: 24,
  h: 28,
};

if (
  playerBox.x < h.x + h.w &&
  playerBox.x + playerBox.w > h.x &&
  playerBox.y < h.y + h.h &&
  playerBox.y + playerBox.h > h.y
)
 {
          running = false;
          setGameOver(true);
          setGameStarted(false);

          if (scoreRef.current > best) {
            localStorage.setItem("bestRun", scoreRef.current);
            setBest(scoreRef.current);
          }
          return;
        }
      }

      // reward stamps
      if (frame % 180 === 0) {
        stamps.push({ x: canvas.width, y: 150 });
      }

      stamps = stamps.filter((s) => s.x > -50);

      for (let i = stamps.length - 1; i >= 0; i--) {
        let s = stamps[i];
        s.x -= speed;

        ctx.font = "24px Arial";
        ctx.fillText("🃏", s.x, s.y);

        if (
          player.x < s.x + 20 &&
          player.x + 20 > s.x &&
          Math.abs((player.y - 20) - s.y) < 35
        ) {
          stamps.splice(i, 1);

          const newScore = scoreRef.current + 10;
scoreRef.current = newScore;
setScore(newScore);
          setPoints((p) => p + 10);
        }
      }

      // live score inside canvas
      ctx.fillStyle = "#5b3a00";
ctx.fillRect(0, 205, canvas.width, 5);

ctx.fillStyle = "#3b2400";
ctx.fillRect(0, 210, canvas.width, 40);
      ctx.font = "18px Arial";
      ctx.fillText(`Score: ${scoreRef.current}`, 20, 30);

      frame++;
      animationRef.current = requestAnimationFrame(loop);
    }

    loop();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("keydown", handleKey);
    };
  }, [gameStarted, gamePaused, restartKey, setPoints, best]);

  const handleStart = () => {
    setGameStarted(true);
    setGamePaused(false);
    setRestartKey((k) => k + 1);
  };

  const handleStop = () => {
    setGamePaused(true);
    cancelAnimationFrame(animationRef.current);
  };

  const handleRestart = () => {
    setGameStarted(true);
    setGamePaused(false);
    setGameOver(false);
    setRestartKey((k) => k + 1);
  };

  return (
    <div className="game-card premium-card">
      <h3>🏃 Stamp Runner</h3>
      <p>Collect stamps and avoid red hurdles</p>

      <canvas ref={canvasRef} width={650} height={250} />

      {!gameStarted && !gameOver && (
        <button className="game-action-btn start-btn" onClick={handleStart}>
          ▶ Start Game
        </button>
      )}

      {gameStarted && !gamePaused && !gameOver && (
        <>
          <button className="jump-btn" onClick={() => jumpRef.current()}>
            ⬆ Jump
          </button>

          <button className="game-action-btn stop-btn" onClick={handleStop}>
            ⏸ Stop Game
          </button>
        </>
      )}

      {(gamePaused || gameOver) && (
        <button className="game-action-btn restart-btn" onClick={handleRestart}>
          🔄 Restart Game
        </button>
      )}

      <p>⭐ Current Score: {score}</p>
      <p>🏆 Best: {best}</p>
    </div>
  );
}

/* ================= LEADERBOARD ================= */
function Leaderboard({ points }) {
  const players = [
    { name: "Ramesh K.", score: 4200 },
    { name: "Priya M.", score: 3850 },
    { name: "You", score: points },
    { name: "Ahmed R.", score: 980 },
    { name: "Sunita B.", score: 760 },
  ];

  return (
    <div className="leaderboard premium-card">
      <h3>🏆 Leaderboard — This Week</h3>
      {players.map((p, i) => (
        <div key={i} className="leader-row">
          <span>{p.name}</span>
          <span>{p.score}</span>
        </div>
      ))}
    </div>
  );
}

/* ================= MAIN ================= */
export default function HomeSections() {
  const [points, setPoints] = useState(
    parseInt(localStorage.getItem("points")) || 0
  );

  useEffect(() => {
    localStorage.setItem("points", points);
  }, [points]);

  return (
    <div className="home-sections">
      <FeatureStrip />
      {/* <TrackingCard /> */}
      <AudioNewsCard />

      <section className="games-section" id="games">
        <h2>Stamp Games & Challenges</h2>

        <div className="games-grid">
          <Quiz setPoints={setPoints} />
          <RunnerGame setPoints={setPoints} />
        </div>

        <div className="stats-panel premium-card">
          <div className="points-big">{points}</div>
          <p>Total Points</p>
          <Leaderboard points={points} />
        </div>
      </section>
    </div>
  );
}