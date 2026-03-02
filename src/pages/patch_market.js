const fs = require('fs');

var text = fs.readFileSync('Money.jsx', 'utf8');

var start_marker = "{/* ─── Market Intelligence (Deck) ─── */}";
var end_marker = "{/* ─── Portfolio Vault (List) ─── */}";

var start_idx = text.indexOf(start_marker);
var end_idx = text.indexOf(end_marker);

var new_market = `{/* ─── Market Intelligence (Deck) ─── */}
      <motion.div variants={stagger.item} style={{ marginTop: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', letterSpacing: 1.5, textTransform: 'uppercase' }}>
            Market Intelligence
          </h3>
        </div>

        <ScrollRow gap={20}>
          {marketInsights.map((item, i) => (
            <div 
              key={i }
              style={{ 
                minWidth: '100%', 
                scrollSnapAlign: 'center',
                background: item.bg || '#FFFFFF',
                borderRadius: 40,
                padding: '36px 32px 32px',
                border: '1px solid rgba(0,0,0,0.08)',
                boxShadow: i === 0 ? '0 32px 64px -16px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.02)' : '0 4px 16px -4px rgba(0,0,0,0.06)',
                position: 'relative',
                display: 'flex', flexDirection: 'column',
                height: '62vh'
              }}
              onClick={() => navigate('/advisor', { state: { activeItem: item, context: 'market', allItems: marketInsights } })}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <div style={{ 
                      fontSize: 12, fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: 1.5,
                      background: 'rgba(255,255,255,0.5)', padding: '10px 18px', borderRadius: 100
                  }}>{item.benefit}</div>
                  
                  <div style={{
                      position: 'relative', width: 52, height: 52, borderRadius: '50%', background: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: \0hh8px 16px -4px rgba(0,0,0,0.05)\`
                  }}>
                      <div style={{ width: 12, height: 12, borderRadius: '50%', background: item.color }} />
                  </div>
              </div>
              
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{
                      position: 'absolute', top: -50, right: -50, width: 200, height: 200,
                      borderRadius: '50%', background: item.color,
                      opacity: 0.1, filter: 'blur(60px)', pointerEvents: 'none'
                  }} />
                  <h4 style={{ fontSize: 44, fontWeight: 900, color: '#0F172A', marginBottom: 24, letterSpacing: -2.8, lineHeight: 0.92, zIndex: 1 }}>
                      {item.title}
                  </h4>
                  
                  <div style={{ marginTop: 'auto', marginBottom: 4, display: 'inline-flex', zIndex: 1 }}>
                      <div style={{
                          background: '#FEF08A', border: '2px solid #0F172A', borderRadius: 16, padding: '12px 20px',
                          fontSize: 18, fontWeight: 800, color: '#0F172A', boxShadow: '4px 4px 0px #0F172A'
                      }}>
                          {item.subtitle}
                      </div>
                  </div>
              </div>

              <div style={{ marginTop: 'auto', zIndex: 1 }}>
                  <button onClick={(e) => { e.stopPropagation(); navigate('/advisor', { state: { activeItem: item, context: 'market', allItems: marketInsights } }) }} style={{ 
                      width: '100%', padding: '24px', borderRadius: 32, background: '#0F172A', color: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: 'none', cursor: 'pointer',
                      boxShadow: '0 16px 32px -8px rgba(15, 23, 42, 0.25)' 
                  }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: 13, textTransform: 'uppercase', opacity: 0.7, letterSpacing: 1, marginBottom: 2 }}>Action</span>
                          <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.5 }}>View Insights</span>
                      </div>
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'white', color: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <ArrowRight size={24} strokeWidth={3} />
                      </div>
                  </button>
              </div>
            </div>
          ))}
        </ScrollRow>
      </motion.div>

      `;


var new_text = text.substring(0, start_idx) + new_market + text.substring(end_idx);
fs.writeFileSync('Money.jsx', new_text);
console.log('Market DONE');