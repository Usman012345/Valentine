import React, { useEffect, useRef, useState } from 'react'

const DEFAULT_MEMES = [
  { title: "Cuddle mode: ON 😽", src: "/date1.jpeg" },
  { title: "A heart just for you 💗", src: "/date2.png" },
  { title: "Officially your Valentine 🥺", src: "/date3.jpeg" },
]

function clamp(n, min, max){
  return Math.max(min, Math.min(max, n))
}

export default function App(){
  const playRef = useRef(null)
  const noBtnRef = useRef(null)

  const [stage, setStage] = useState("ask") // ask | date
  const [noPos, setNoPos] = useState({ left: 20, top: 118 })
  const [noHoverCount, setNoHoverCount] = useState(0)
  const [noModalOpen, setNoModalOpen] = useState(false)
  const [memes, setMemes] = useState(DEFAULT_MEMES)
  const [loadingMemes, setLoadingMemes] = useState(false)

  // Starts normal next to Yes, then becomes shy and starts dodging.
  const [noIsShy, setNoIsShy] = useState(false)

  const hoverGoal = 5

  function randomizeNoPosition(){
    const play = playRef.current
    const btn = noBtnRef.current
    if(!play || !btn) return

    const pr = play.getBoundingClientRect()
    const br = btn.getBoundingClientRect()

    const pad = 12
    const maxLeft = Math.max(pad, pr.width - br.width - pad)
    const maxTop  = Math.max(pad, pr.height - br.height - pad)

    const left = clamp(Math.random() * maxLeft, pad, maxLeft)
    const top  = clamp(Math.random() * maxTop,  pad, maxTop)

    setNoPos({ left, top })
  }

  function resetAskState(){
    setStage("ask")
    setNoModalOpen(false)
    setNoHoverCount(0)
    setNoIsShy(false)
    setTimeout(() => randomizeNoPosition(), 60)
  }

  function triggerNoMeme(){
    setNoModalOpen(true)
    setNoHoverCount(0) // reset counter as requested
  }

  function onNoHover(){
    if(!noIsShy) setNoIsShy(true)
    randomizeNoPosition()
    setNoHoverCount((c) => {
      const next = c + 1
      if(next >= hoverGoal){
        setTimeout(() => triggerNoMeme(), 0)
        return 0
      }
      return next
    })
  }

  async function onYes(){
    setStage("date")
    setNoModalOpen(false)

    // Fetch from backend (Mongo-backed when configured), but gracefully fall back
    setLoadingMemes(true)
    try{
      const res = await fetch("/api/memes", { headers: { "Accept": "application/json" } })
      if(res.ok){
        const data = await res.json()
        if(Array.isArray(data) && data.length){
          setMemes(data)
        }
      }
    }catch(e){
      // ignore
    }finally{
      setLoadingMemes(false)
    }
  }

  // On first load, pre-compute a random position for when "No" starts running away.
  useEffect(() => {
    const t = setTimeout(() => randomizeNoPosition(), 80)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Close modal on Esc
  useEffect(() => {
    function onKey(e){
      if(e.key === "Escape") setNoModalOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <div className="container">
      <div className="card">
        <div className="sparkles" />

        <div className="header">
          <div className="brand">
            <div className="badge">🐱</div>
            <div>
              <h1>Will you be my Valentine?</h1>
              <div className="sub">Cute • romantic • and the “No” button is extremely shy.</div>
            </div>
          </div>
        </div>

        <div className="hero">
          <div className="illustration">
            <div className="roseFloat rose1">🌹</div>
            <div className="roseFloat rose2">🌹</div>
            <div className="roseFloat rose3">💗</div>

            <div className="cuteRow" aria-label="cat with roses">
              <span>🐱</span><span>🌹</span><span>🌹</span><span>💘</span>
            </div>
            <div className="caption">A tiny cat brought roses. Please say yes. It practiced all week.</div>

            <div className="banner" style={{marginTop: 16}}>
              <div>
                <div className="bigLove">
                  {stage === "ask" ? "Be my Valentine, pretty please? 🥺" : "It’s a date!! 💞"}
                </div>
                <div className="smallLove">
                  {stage === "ask"
                    ? "P.S. The “No” button starts brave… then panics."
                    : "Okayyyyy. Three big cute memes incoming."
                  }
                </div>
              </div>
              <div style={{fontSize: 26}} aria-hidden="true">✨💗🌹</div>
            </div>
          </div>

          <div className="playArea" ref={playRef}>
            {stage === "ask" ? (
              <>
                <div className="question">So… what do you say? 💌</div>

                <div className="buttons">
                  <button className="btn btnYes" onClick={onYes}>
                    Yes 💖
                  </button>

                  {/* Starts normal next to Yes, then becomes shy and moves around */}
                  {!noIsShy ? (
                    <button
                      ref={noBtnRef}
                      className="btn btnNo"
                      onMouseEnter={onNoHover}
                      onClick={triggerNoMeme}
                      aria-label="No button (it will try to escape)"
                    >
                      No 🙃
                    </button>
                  ) : null}
                </div>

                {noIsShy ? (
                  <div className="noWrap" style={{ left: noPos.left, top: noPos.top }}>
                    <button
                      ref={noBtnRef}
                      className="btn btnNo"
                      onMouseEnter={onNoHover}
                      onClick={triggerNoMeme}
                      aria-label="No button (it will try to escape)"
                    >
                      No 🙃
                    </button>
                  </div>
                ) : null}
              </>
            ) : (
              <>
                <div className="dateTopRow">
                  <button className="btn btnNo" onClick={resetAskState}>
                    ← Back
                  </button>

                  <div className="dateTopText">
                    <div className="dateTopTitle">It’s a date!! 💞</div>
                    <div className="dateTopSub">{loadingMemes ? "Loading cuteness…" : "Okay, pick your favorite one 😽"}</div>
                  </div>
                </div>

                <div className="bigGallery" aria-label="valentine meme gallery">
                  {memes.slice(0, 3).map((m, idx) => (
                    <button
                      key={idx}
                      className="bigMemeCard"
                      type="button"
                      onClick={() => {}}
                      aria-label={m.title}
                      title={m.title}
                    >
                      <img src={m.src} alt={m.title} loading="lazy" />
                      <div className="bigMemeCaption">{m.title}</div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {noModalOpen && (
          <div className="modalOverlay" role="dialog" aria-modal="true" aria-label="No-button meme">
            <div className="modal">
              <div className="modalTop">
                <div className="modalTitle">The “No” button has been captured. 😼</div>
                <button className="closeBtn" onClick={() => setNoModalOpen(false)}>Close</button>
              </div>
              <img src="/nope.jpeg" alt="Funny cat meme (triggered by No button)" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
