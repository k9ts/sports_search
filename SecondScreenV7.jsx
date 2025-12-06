import React, { useState, useEffect } from 'react';

// ============================================
// GAME DATA - EAGLES VS BEARS
// ============================================

const USER_FAVORITE_TEAM = 'PHI';

const GAME_DATA = {
  homeTeam: { name: 'Eagles', abbrev: 'PHI', color: '#004C54', secondary: '#A5ACAF', record: '12-2', isFavorite: true },
  awayTeam: { name: 'Bears', abbrev: 'CHI', color: '#0B162A', secondary: '#C83803', record: '4-10', isFavorite: false },
  homeScore: 31, awayScore: 17, quarter: 4, time: '6:48',
  possession: 'home', down: '1st & 10', yardLine: 'PHI 35',
};

const CURRENT_DRIVE = [
  { description: 'Barkley run up the middle for 8 yards', result: 'positive', time: '7:52' },
  { description: 'Hurts pass to A.J. Brown for 22 yards', result: 'first_down', time: '7:15' },
  { description: 'Barkley run left side for 4 yards', result: 'positive', time: '6:48' },
];

const WIN_PROB = { home: 94, away: 6 };
const SOCIAL_ACTIVITY = { postsPerMin: 2847, activeUsers: '412K', level: 'INSANE' };

const MOMENTS = [
  { id: 1, type: 'touchdown', timestamp: '3 min ago', title: 'TOUCHDOWN EAGLES', description: 'Saquon Barkley takes the handoff, finds a hole, and bursts through for a 45-yard TD run. His 3rd TD of the game!', player: 'Saquon Barkley', team: 'PHI', liveReacting: 24500, clipDuration: '0:38', clipViews: '287K', isMyTeam: true },
  { id: 2, type: 'turnover', timestamp: '8 min ago', title: 'INTERCEPTION - EAGLES BALL', description: 'C.J. Gardner-Johnson reads Caleb Williams perfectly and picks it off at the PHI 30.', player: 'C.J. Gardner-Johnson', team: 'PHI', liveReacting: 18200, clipDuration: '0:24', clipViews: '156K', isMyTeam: true },
  { id: 3, type: 'touchdown', timestamp: '15 min ago', title: 'BEARS TOUCHDOWN', description: 'Caleb Williams finds DJ Moore on a 12-yard slant for the score.', player: 'DJ Moore', team: 'CHI', liveReacting: 8400, clipDuration: '0:26', clipViews: '67K', isMyTeam: false },
];

// Connected integrations (user has linked these)
const CONNECTED_INTEGRATIONS = {
  fantasy: { platform: 'ESPN Fantasy', leagueName: 'Philly Fanatics League', connected: true },
  sportsbook: { platform: 'FanDuel', connected: true },
  reddit: { connected: true, subreddit: 'r/eagles' },
};

// My Players - from connected ESPN Fantasy account
const MY_PLAYERS = [
  { name: 'Jalen Hurts', team: 'PHI', pos: 'QB', points: 28.4, projected: 24.2, trend: '+4.2', status: 'boom', isMyTeam: true },
  { name: 'Saquon Barkley', team: 'PHI', pos: 'RB', points: 38.6, projected: 22.5, trend: '+16.1', status: 'boom', isMyTeam: true },
  { name: 'A.J. Brown', team: 'PHI', pos: 'WR', points: 21.8, projected: 16.4, trend: '+5.4', status: 'boom', isMyTeam: true },
  { name: 'DJ Moore', team: 'CHI', pos: 'WR', points: 14.2, projected: 12.8, trend: '+1.4', status: 'on_pace', isMyTeam: false },
];

// My Bets - from connected FanDuel account
const MY_BETS = [
  { pick: 'Eagles -10.5', odds: '-110', wager: 100, status: 'hit', note: 'Covering by 14' },
  { pick: 'Barkley O89.5 rush yds', odds: '-115', wager: 50, status: 'hit', note: '142 yards' },
  { pick: 'Barkley Anytime TD', odds: '-125', wager: 75, status: 'hit', note: '3 TDs! 🔥' },
  { pick: 'Eagles O27.5 pts', odds: '-108', wager: 40, status: 'hit', note: '31 points' },
];

// Reddit game thread data (from connected Reddit)
const REDDIT_THREAD = {
  subreddit: 'r/eagles',
  title: 'Game Thread: Eagles vs Bears - Week 16',
  upvotes: '2.4K',
  comments: '8.7K',
  posts: [
    { user: 'u/FlyEaglesFly215', text: 'SAQUON IS A GOD', upvotes: '1.2K', time: '1m', awards: ['🦅', '🔥'] },
    { user: 'u/PhillyPhilly33', text: 'Giants fans in absolute SHAMBLES right now 😂', upvotes: '892', time: '2m', awards: [] },
    { user: 'u/BirdGangForever', text: 'This is the best RB performance I\'ve seen in an Eagles uniform since prime Shady', upvotes: '654', time: '3m', awards: ['🏆'] },
    { user: 'u/KelceEra', text: '3 TDs and still a whole quarter left. Incredible.', upvotes: '445', time: '4m', awards: [] },
  ]
};

// Available widget integrations
const AVAILABLE_WIDGETS = [
  { id: 'reddit', name: 'Reddit', icon: '👽', description: 'Game threads & discussions', color: '#FF4500', connected: true },
  { id: 'discord', name: 'Discord', icon: '💬', description: 'Your server\'s game chat', color: '#5865F2', connected: false },
  { id: 'youtube', name: 'YouTube', icon: '📺', description: 'Live reactions & streams', color: '#FF0000', connected: false },
  { id: 'twitch', name: 'Twitch', icon: '🎮', description: 'Streamers watching live', color: '#9146FF', connected: false },
  { id: 'twitter_list', name: 'Twitter List', icon: '📋', description: 'Your curated lists', color: '#1DA1F2', connected: false },
  { id: 'radio', name: 'Radio', icon: '📻', description: 'Local radio broadcast', color: '#10B981', connected: false },
  { id: 'group_chat', name: 'Group Chat', icon: '💭', description: 'Launch iMessage/WhatsApp', color: '#25D366', connected: false },
];

// Social feed data
const SOCIAL_TOPICS = [
  { label: '#FlyEaglesFly', isMyTeam: true },
  { label: 'Saquon', isMyTeam: true },
  { label: '#Eagles', isMyTeam: true },
  { label: '#DaBears', isMyTeam: false },
];

const LIVE_TWEETS = {
  '#FlyEaglesFly': [
    { id: 1, user: '@Eagles', verified: true, text: 'SAQUON BARKLEY ARE YOU SERIOUS?! 45-YARD TUDDY! 🦅 #FlyEaglesFly', time: '12s', likes: '28.4K', isTeamAccount: true },
    { id: 2, user: '@JClarkNBCS', verified: true, text: 'Barkley has 142 rushing yards and 3 TDs. In the first 3 quarters. This man is DIFFERENT.', time: '45s', likes: '4.2K' },
    { id: 3, user: '@BaldyNFL', verified: true, text: 'Barkley makes the first man miss EVERY. SINGLE. TIME. His vision is elite.', time: '2m', likes: '8.9K' },
    { id: 4, user: '@PatMcAfeeShow', verified: true, text: 'THE EAGLES ARE WAGON. This team is going to be SCARY in the playoffs.', time: '3m', likes: '12.4K' },
  ],
  'Saquon': [
    { id: 1, user: '@SaquonBarkley', verified: true, text: '🦅', time: '5m', likes: '89.2K', isPlayerAccount: true },
    { id: 2, user: '@ESPNStatsInfo', verified: true, text: 'Saquon Barkley has 1,623 rushing yards this season. On pace to break the Eagles single-season record.', time: '1m', likes: '9.2K' },
    { id: 3, user: '@NFLFantasy', verified: true, text: 'If you started Saquon Barkley today, congrats on your fantasy championship. 🏆', time: '2m', likes: '11.3K' },
  ],
  '#Eagles': [
    { id: 1, user: '@NFL', verified: true, text: 'Saquon Barkley today: 22 carries, 142 yards, 3 TDs. Monster performance. 🦅', time: '1m', likes: '18.2K' },
    { id: 2, user: '@RapSheet', verified: true, text: 'Eagles clinch NFC East with a win today. Been the class of the conference all year.', time: '4m', likes: '6.1K' },
  ],
  '#DaBears': [
    { id: 1, user: '@ChicagoBears', verified: true, text: 'Let\'s finish strong. 🐻⬇️', time: '3m', likes: '2.1K', isTeamAccount: true },
    { id: 2, user: '@JJStankevitz', verified: true, text: 'Rough day but good to see Caleb Williams put together some nice drives.', time: '4m', likes: '890' },
  ],
};

// ============================================
// UTILITY
// ============================================

const getTeamColor = (team) => team === 'PHI' ? '#004C54' : '#0B162A';
const getMomentStyle = (type) => {
  const map = {
    touchdown: { color: '#10B981', label: 'TD' },
    turnover: { color: '#EF4444', label: 'TO' },
    big_play: { color: '#8B5CF6', label: 'BIG' },
  };
  return map[type] || { color: '#6B7280', label: '•' };
};

// ============================================
// COMPONENTS
// ============================================

// Score Section
const ScoreSection = ({ game, drive }) => {
  const [pulse, setPulse] = useState(true);
  useEffect(() => {
    const i = setInterval(() => setPulse(p => !p), 1000);
    return () => clearInterval(i);
  }, []);

  return (
    <div style={styles.scoreSection}>
      <div style={styles.scoreTop}>
        <div style={styles.liveTag}>
          <span style={{...styles.liveDot, opacity: pulse ? 1 : 0.3, boxShadow: pulse ? '0 0 8px #EF4444' : 'none'}} />
          <span style={styles.liveText}>LIVE</span>
        </div>
        <span style={styles.broadcast}>FOX • Week 16</span>
      </div>

      <div style={styles.scoreMain}>
        <div style={styles.teamBlock}>
          <div style={{...styles.teamLogo, backgroundColor: game.awayTeam.color}}>{game.awayTeam.abbrev}</div>
          <div style={styles.teamInfo}>
            <span style={styles.teamName}>{game.awayTeam.name}</span>
            <span style={styles.teamRecord}>{game.awayTeam.record}</span>
          </div>
          <div style={styles.scoreNum}>{game.awayScore}</div>
        </div>

        <div style={styles.clockBlock}>
          <div style={styles.clockTime}>{game.time}</div>
          <div style={styles.quarterBadge}>Q{game.quarter}</div>
        </div>

        <div style={{...styles.teamBlock, flexDirection: 'row-reverse'}}>
          <div style={{...styles.teamLogo, backgroundColor: game.homeTeam.color}}>{game.homeTeam.abbrev}</div>
          <div style={{...styles.teamInfo, alignItems: 'flex-end'}}>
            <div style={styles.teamNameRow}>
              <span style={styles.teamName}>{game.homeTeam.name}</span>
              {game.homeTeam.isFavorite && <span style={styles.myTeamBadge}>MY TEAM</span>}
            </div>
            <span style={styles.teamRecord}>{game.homeTeam.record}</span>
          </div>
          <div style={styles.scoreNum}>{game.homeScore}</div>
          {game.possession === 'home' && <span style={styles.possessionArrow}>◀</span>}
        </div>
      </div>

      <div style={styles.situationBar}>
        <span style={styles.situationDown}>{game.down}</span>
        <span style={styles.situationDivider}>•</span>
        <span style={styles.situationField}>{game.yardLine}</span>
        {game.possession === 'home' && <span style={styles.situationTeam}>🦅 Eagles ball</span>}
      </div>

      <div style={styles.driveSection}>
        <div style={styles.driveHeader}>
          <span style={styles.driveLabel}>CURRENT DRIVE</span>
          <span style={styles.driveStats}>3 plays • 34 yards • 1:42</span>
        </div>
        <div style={styles.drivePlays}>
          {drive.map((play, i) => (
            <div key={i} style={styles.drivePlay}>
              <span style={{...styles.playIndicator, backgroundColor: play.result === 'first_down' ? '#10B981' : play.result === 'positive' ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.2)'}} />
              <span style={styles.playTime}>{play.time}</span>
              <span style={styles.playDesc}>{play.description}</span>
              {play.result === 'first_down' && <span style={styles.firstDownBadge}>1ST</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Game Pulse
const GamePulse = ({ winProb, social, homeTeam, awayTeam }) => (
  <div style={styles.pulseBar}>
    <div style={styles.pulseCard}>
      <div style={styles.pulseCardHeader}>
        <span style={styles.pulseLabel}>WIN PROBABILITY</span>
      </div>
      <div style={styles.winProbContent}>
        <div style={styles.winProbTeam}>
          <span style={{color: awayTeam.color}}>{awayTeam.abbrev}</span>
          <span style={styles.winProbPctSmall}>{winProb.away}%</span>
        </div>
        <div style={styles.winProbBarWrap}>
          <div style={styles.winProbBar}>
            <div style={{...styles.winProbFillAway, width: `${winProb.away}%`, backgroundColor: awayTeam.color}} />
            <div style={{...styles.winProbFillHome, width: `${winProb.home}%`, backgroundColor: homeTeam.color}} />
          </div>
        </div>
        <div style={{...styles.winProbTeam, alignItems: 'flex-end'}}>
          <span style={{color: homeTeam.color}}>{homeTeam.abbrev}</span>
          <span style={styles.winProbPctLarge}>{winProb.home}%</span>
        </div>
      </div>
    </div>

    <div style={styles.pulseCard}>
      <div style={styles.pulseCardHeader}>
        <span style={styles.pulseLabel}>SOCIAL ACTIVITY</span>
        <span style={styles.activityBadge}>{social.level}</span>
      </div>
      <div style={styles.socialActivityContent}>
        <div style={styles.activityMetric}>
          <span style={styles.activityBigNum}>{(social.postsPerMin / 1000).toFixed(1)}K</span>
          <span style={styles.activityLabel}>posts/min</span>
        </div>
        <div style={styles.activityViz}>
          {[...Array(16)].map((_, i) => (
            <div key={i} style={{...styles.vizBar, height: `${15 + Math.random() * 35}px`, backgroundColor: i > 10 ? '#10B981' : 'rgba(16,185,129,0.4)'}} />
          ))}
        </div>
        <div style={styles.activityMetric}>
          <span style={styles.activityBigNum}>{social.activeUsers}</span>
          <span style={styles.activityLabel}>watching</span>
        </div>
      </div>
    </div>
  </div>
);

// Moment Card
const MomentCard = ({ moment }) => {
  const style = getMomentStyle(moment.type);
  return (
    <div style={{...styles.momentCard, borderLeftColor: moment.isMyTeam ? '#004C54' : getTeamColor(moment.team), backgroundColor: moment.isMyTeam ? 'rgba(0,76,84,0.1)' : 'rgba(20,20,28,0.8)'}}>
      <div style={styles.momentTop}>
        <span style={{...styles.momentBadge, backgroundColor: `${style.color}22`, color: style.color}}>{style.label}</span>
        {moment.isMyTeam && <span style={styles.myTeamMomentBadge}>🦅</span>}
        <span style={styles.momentTime}>{moment.timestamp}</span>
        <div style={styles.momentReacting}>
          <span style={styles.reactDot}>●</span>
          {(moment.liveReacting / 1000).toFixed(1)}K
        </div>
      </div>
      <h4 style={styles.momentTitle}>{moment.title}</h4>
      <p style={styles.momentDesc}>{moment.description}</p>
      <div style={styles.momentClip}>
        <div style={{...styles.clipThumb, borderColor: moment.isMyTeam ? '#004C54' : style.color}}>▶</div>
        <div style={styles.clipMeta}>
          <span style={styles.clipDuration}>{moment.clipDuration}</span>
          <span style={styles.clipViews}>{moment.clipViews} views</span>
        </div>
      </div>
    </div>
  );
};

// Live Social Feed
const LiveSocialFeed = ({ topics, tweets }) => {
  const [activeTopic, setActiveTopic] = useState(topics[0].label);
  const currentTweets = tweets[activeTopic] || [];

  return (
    <div style={styles.socialFeed}>
      <div style={styles.feedHeader}>
        <h3 style={styles.feedTitle}>📡 Live Feed</h3>
        <span style={styles.feedLive}>● REAL-TIME</span>
      </div>
      <div style={styles.topicPills}>
        {topics.map(topic => (
          <button key={topic.label} onClick={() => setActiveTopic(topic.label)} style={{
            ...styles.topicPill,
            backgroundColor: activeTopic === topic.label ? (topic.isMyTeam ? 'rgba(0,76,84,0.3)' : 'rgba(255,255,255,0.1)') : 'rgba(255,255,255,0.05)',
            color: activeTopic === topic.label ? (topic.isMyTeam ? '#00A67E' : '#fff') : 'rgba(255,255,255,0.5)',
            borderColor: activeTopic === topic.label && topic.isMyTeam ? '#004C54' : 'transparent',
          }}>
            {topic.isMyTeam && <span style={styles.pillTeamIcon}>🦅</span>}
            {topic.label}
          </button>
        ))}
      </div>
      <div style={styles.addTopicRow}>
        <input placeholder="Add topic or #hashtag..." style={styles.addTopicInput} />
        <button style={styles.addTopicBtn}>+</button>
      </div>
      <div style={styles.tweetStream}>
        {currentTweets.map(tweet => (
          <div key={tweet.id} style={{...styles.tweet, borderLeftColor: tweet.isTeamAccount ? '#004C54' : 'transparent', borderLeftWidth: tweet.isTeamAccount ? '3px' : '0', borderLeftStyle: 'solid'}}>
            <div style={styles.tweetHeader}>
              <span style={styles.tweetUser}>{tweet.user}{tweet.verified && <span style={styles.verified}>✓</span>}</span>
              <span style={styles.tweetTime}>{tweet.time}</span>
            </div>
            <p style={styles.tweetText}>{tweet.text}</p>
            <span style={styles.tweetLikes}>♥ {tweet.likes}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// My Players Card (Connected to ESPN)
const MyPlayersCard = ({ players, integration }) => {
  const getStatusColor = (status) => status === 'boom' ? '#10B981' : status === 'bust' ? '#EF4444' : 'rgba(255,255,255,0.5)';
  const totalVsProj = players.reduce((acc, p) => acc + parseFloat(p.trend), 0);

  return (
    <div style={styles.widgetCard}>
      <div style={styles.widgetHeader}>
        <div style={styles.widgetTitleRow}>
          <span style={styles.widgetIcon}>⭐</span>
          <span style={styles.widgetTitle}>My Players</span>
        </div>
        <div style={styles.connectedBadge}>
          <span style={styles.connectedDot}>●</span>
          <span>{integration.platform}</span>
        </div>
      </div>
      <div style={styles.widgetSubtitle}>{integration.leagueName}</div>
      
      <div style={styles.playersList}>
        {players.map((p, i) => (
          <div key={i} style={{...styles.playerRow, backgroundColor: p.isMyTeam ? 'rgba(0,76,84,0.15)' : 'rgba(0,0,0,0.2)'}}>
            <div style={{...styles.playerDot, backgroundColor: getTeamColor(p.team)}} />
            <div style={styles.playerInfo}>
              <span style={styles.playerName}>{p.name} {p.isMyTeam && '🦅'}</span>
              <span style={styles.playerMeta}>{p.pos} • {p.team}</span>
            </div>
            <div style={styles.playerPoints}>
              <span style={styles.pointsNum}>{p.points}</span>
              <span style={{...styles.pointsTrend, color: getStatusColor(p.status)}}>{p.trend}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div style={styles.widgetFooter}>
        <span>Total vs Projection</span>
        <span style={styles.footerValue}>+{totalVsProj.toFixed(1)} pts 🔥</span>
      </div>
    </div>
  );
};

// My Bets Card (Connected to FanDuel)
const MyBetsCard = ({ bets, integration }) => {
  const getStatusColor = (status) => status === 'hit' || status === 'winning' ? '#10B981' : '#EF4444';
  const hitsCount = bets.filter(b => b.status === 'hit').length;

  return (
    <div style={styles.widgetCard}>
      <div style={styles.widgetHeader}>
        <div style={styles.widgetTitleRow}>
          <span style={styles.widgetIcon}>🎯</span>
          <span style={styles.widgetTitle}>My Bets</span>
        </div>
        <div style={styles.connectedBadge}>
          <span style={styles.connectedDot}>●</span>
          <span>{integration.platform}</span>
        </div>
      </div>
      
      <div style={styles.betsList}>
        {bets.map((b, i) => (
          <div key={i} style={{...styles.betRow, backgroundColor: b.status === 'hit' ? 'rgba(16,185,129,0.1)' : 'rgba(0,0,0,0.2)'}}>
            <div style={{...styles.betStatusDot, backgroundColor: getStatusColor(b.status)}} />
            <div style={styles.betInfo}>
              <span style={styles.betPick}>{b.pick}</span>
              <span style={styles.betMeta}>{b.odds} • ${b.wager}</span>
            </div>
            <div style={styles.betStatus}>
              <span style={{...styles.betStatusLabel, color: getStatusColor(b.status)}}>
                {b.status === 'hit' ? '✓ HIT' : '↓'}
              </span>
              <span style={styles.betNote}>{b.note}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div style={styles.widgetFooter}>
        <span>{hitsCount}/{bets.length} Hitting! 💰</span>
        <span style={styles.footerValueLarge}>+$482</span>
      </div>
    </div>
  );
};

// Reddit Widget (Connected)
const RedditWidget = ({ thread }) => (
  <div style={styles.widgetCard}>
    <div style={styles.widgetHeader}>
      <div style={styles.widgetTitleRow}>
        <span style={styles.widgetIcon}>👽</span>
        <span style={styles.widgetTitle}>{thread.subreddit}</span>
      </div>
      <div style={{...styles.connectedBadge, backgroundColor: 'rgba(255,69,0,0.15)', color: '#FF4500'}}>
        <span style={styles.connectedDot}>●</span>
        <span>Reddit</span>
      </div>
    </div>
    <div style={styles.redditMeta}>
      <span>⬆ {thread.upvotes}</span>
      <span>💬 {thread.comments}</span>
    </div>
    
    <div style={styles.redditPosts}>
      {thread.posts.map((post, i) => (
        <div key={i} style={styles.redditPost}>
          <div style={styles.redditPostHeader}>
            <span style={styles.redditUser}>{post.user}</span>
            <span style={styles.redditTime}>{post.time}</span>
          </div>
          <p style={styles.redditText}>{post.text}</p>
          <div style={styles.redditPostFooter}>
            <span style={styles.redditUpvotes}>⬆ {post.upvotes}</span>
            {post.awards.map((award, j) => <span key={j} style={styles.redditAward}>{award}</span>)}
          </div>
        </div>
      ))}
    </div>
    
    <button style={styles.redditOpenBtn}>Open in Reddit →</button>
  </div>
);

// Add Widget Card
const AddWidgetCard = ({ widgets, onAdd }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isExpanded) {
    return (
      <button style={styles.addWidgetCollapsed} onClick={() => setIsExpanded(true)}>
        <span style={styles.addWidgetPlus}>+</span>
        <span style={styles.addWidgetText}>Add Widget</span>
      </button>
    );
  }

  return (
    <div style={styles.addWidgetExpanded}>
      <div style={styles.addWidgetHeader}>
        <span style={styles.addWidgetTitle}>Add Widget</span>
        <button style={styles.addWidgetClose} onClick={() => setIsExpanded(false)}>✕</button>
      </div>
      <p style={styles.addWidgetDesc}>Connect your favorite apps and communities</p>
      
      <div style={styles.widgetOptions}>
        {widgets.map(w => (
          <button key={w.id} style={{...styles.widgetOption, opacity: w.connected ? 0.5 : 1}} disabled={w.connected}>
            <span style={{...styles.widgetOptionIcon, backgroundColor: `${w.color}20`, color: w.color}}>{w.icon}</span>
            <div style={styles.widgetOptionInfo}>
              <span style={styles.widgetOptionName}>{w.name}</span>
              <span style={styles.widgetOptionDesc}>{w.connected ? 'Connected' : w.description}</span>
            </div>
            {w.connected ? (
              <span style={styles.widgetConnectedCheck}>✓</span>
            ) : (
              <span style={styles.widgetConnectBtn}>Connect</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

// ============================================
// MAIN APP
// ============================================

export default function SecondScreenApp() {
  const [activeView, setActiveView] = useState('live');

  return (
    <div style={styles.app}>
      <div style={styles.bgGradient} />
      
      <ScoreSection game={GAME_DATA} drive={CURRENT_DRIVE} />
      <GamePulse winProb={WIN_PROB} social={SOCIAL_ACTIVITY} homeTeam={GAME_DATA.homeTeam} awayTeam={GAME_DATA.awayTeam} />

      {activeView === 'live' && (
        <div style={styles.mainGrid}>
          {/* Left Column - Moments */}
          <div style={styles.leftCol}>
            <div style={styles.colHeader}>
              <h3 style={styles.colTitle}>⚡ Key Moments</h3>
              <button style={styles.catchUpBtn}>Catch Up</button>
            </div>
            <div style={styles.momentsList}>
              {MOMENTS.map(m => <MomentCard key={m.id} moment={m} />)}
            </div>
          </div>

          {/* Center Column - Live Feed */}
          <div style={styles.centerCol}>
            <LiveSocialFeed topics={SOCIAL_TOPICS} tweets={LIVE_TWEETS} />
          </div>

          {/* Right Column - Widgets */}
          <div style={styles.rightCol}>
            <MyPlayersCard players={MY_PLAYERS} integration={CONNECTED_INTEGRATIONS.fantasy} />
            <MyBetsCard bets={MY_BETS} integration={CONNECTED_INTEGRATIONS.sportsbook} />
            <RedditWidget thread={REDDIT_THREAD} />
            <AddWidgetCard widgets={AVAILABLE_WIDGETS} />
          </div>
        </div>
      )}

      {activeView === 'stats' && (
        <div style={styles.fullContent}>
          <div style={styles.comingSoon}>📊 Stats View</div>
        </div>
      )}

      {activeView === 'clips' && (
        <div style={styles.fullContent}>
          <div style={styles.comingSoon}>🎬 Clips View</div>
        </div>
      )}

      {/* Bottom Nav */}
      <div style={styles.bottomNav}>
        {[
          { id: 'live', icon: '⚡', label: 'Live' },
          { id: 'stats', icon: '📊', label: 'Stats' },
          { id: 'clips', icon: '🎬', label: 'Clips' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveView(tab.id)} style={{
            ...styles.navBtn,
            backgroundColor: activeView === tab.id ? 'rgba(0,76,84,0.3)' : 'transparent',
          }}>
            <span style={styles.navIcon}>{tab.icon}</span>
            <span style={{...styles.navLabel, color: activeView === tab.id ? '#00A67E' : 'rgba(255,255,255,0.5)'}}>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================
// STYLES
// ============================================

const styles = {
  app: { minHeight: '100vh', backgroundColor: '#06060a', color: '#fff', fontFamily: "'Inter', -apple-system, sans-serif" },
  bgGradient: { position: 'fixed', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at 50% -20%, rgba(0,76,84,0.15) 0%, transparent 60%)' },

  // Score Section
  scoreSection: { backgroundColor: 'rgba(12,12,18,0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, zIndex: 100 },
  scoreTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 24px', borderBottom: '1px solid rgba(255,255,255,0.04)' },
  liveTag: { display: 'flex', alignItems: 'center', gap: '6px' },
  liveDot: { width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444', transition: 'all 0.3s' },
  liveText: { fontSize: '10px', fontWeight: '800', letterSpacing: '1px', color: '#EF4444' },
  broadcast: { fontSize: '11px', color: 'rgba(255,255,255,0.4)' },
  scoreMain: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '40px', padding: '16px 24px' },
  teamBlock: { display: 'flex', alignItems: 'center', gap: '14px' },
  teamLogo: { width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '800', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' },
  teamInfo: { display: 'flex', flexDirection: 'column', gap: '2px' },
  teamNameRow: { display: 'flex', alignItems: 'center', gap: '8px' },
  teamName: { fontSize: '18px', fontWeight: '700' },
  teamRecord: { fontSize: '12px', color: 'rgba(255,255,255,0.4)' },
  myTeamBadge: { fontSize: '8px', fontWeight: '800', backgroundColor: 'rgba(0,76,84,0.3)', color: '#00A67E', padding: '3px 6px', borderRadius: '4px' },
  scoreNum: { fontSize: '52px', fontWeight: '800', fontFamily: "'Oswald', sans-serif", letterSpacing: '-2px', minWidth: '70px', textAlign: 'center' },
  possessionArrow: { fontSize: '12px', color: '#00A67E', marginLeft: '-8px' },
  clockBlock: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', minWidth: '80px' },
  clockTime: { fontSize: '32px', fontWeight: '700', fontFamily: "'Oswald', sans-serif" },
  quarterBadge: { fontSize: '11px', fontWeight: '700', color: '#10B981', backgroundColor: 'rgba(16,185,129,0.15)', padding: '3px 10px', borderRadius: '6px' },
  situationBar: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', padding: '10px 24px', backgroundColor: 'rgba(0,76,84,0.1)', borderTop: '1px solid rgba(255,255,255,0.04)' },
  situationDown: { fontSize: '14px', fontWeight: '700' },
  situationDivider: { color: 'rgba(255,255,255,0.3)' },
  situationField: { fontSize: '14px', color: 'rgba(255,255,255,0.7)' },
  situationTeam: { fontSize: '12px', color: '#00A67E', marginLeft: '8px' },
  driveSection: { padding: '12px 24px 16px', backgroundColor: 'rgba(0,0,0,0.2)' },
  driveHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  driveLabel: { fontSize: '10px', fontWeight: '800', letterSpacing: '1px', color: 'rgba(255,255,255,0.4)' },
  driveStats: { fontSize: '11px', color: 'rgba(255,255,255,0.5)' },
  drivePlays: { display: 'flex', flexDirection: 'column', gap: '6px' },
  drivePlay: { display: 'flex', alignItems: 'center', gap: '10px' },
  playIndicator: { width: '6px', height: '6px', borderRadius: '50%' },
  playTime: { fontSize: '11px', color: 'rgba(255,255,255,0.4)', minWidth: '36px' },
  playDesc: { fontSize: '12px', color: 'rgba(255,255,255,0.8)', flex: 1 },
  firstDownBadge: { fontSize: '9px', fontWeight: '700', color: '#10B981', backgroundColor: 'rgba(16,185,129,0.2)', padding: '2px 6px', borderRadius: '4px' },

  // Pulse Bar
  pulseBar: { display: 'flex', gap: '16px', padding: '16px 24px', backgroundColor: 'rgba(15,15,22,0.8)', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  pulseCard: { flex: 1, backgroundColor: 'rgba(20,20,28,0.6)', borderRadius: '12px', padding: '14px 18px' },
  pulseCardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  pulseLabel: { fontSize: '9px', fontWeight: '800', letterSpacing: '1.5px', color: 'rgba(255,255,255,0.4)' },
  activityBadge: { fontSize: '8px', fontWeight: '800', padding: '3px 8px', borderRadius: '4px', backgroundColor: 'rgba(239,68,68,0.2)', color: '#EF4444' },
  winProbContent: { display: 'flex', alignItems: 'center', gap: '14px' },
  winProbTeam: { display: 'flex', flexDirection: 'column', gap: '2px', minWidth: '40px', fontSize: '12px', fontWeight: '700' },
  winProbPctSmall: { fontSize: '14px', color: 'rgba(255,255,255,0.5)' },
  winProbPctLarge: { fontSize: '24px', fontWeight: '800' },
  winProbBarWrap: { flex: 1 },
  winProbBar: { display: 'flex', height: '12px', borderRadius: '6px', overflow: 'hidden' },
  winProbFillAway: { transition: 'width 0.5s' },
  winProbFillHome: { transition: 'width 0.5s' },
  socialActivityContent: { display: 'flex', alignItems: 'flex-end', gap: '14px' },
  activityMetric: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  activityBigNum: { fontSize: '22px', fontWeight: '800', color: '#10B981' },
  activityLabel: { fontSize: '9px', color: 'rgba(255,255,255,0.4)' },
  activityViz: { display: 'flex', alignItems: 'flex-end', gap: '3px', flex: 1, height: '50px' },
  vizBar: { flex: 1, borderRadius: '2px' },

  // Main Grid
  mainGrid: { display: 'grid', gridTemplateColumns: '1fr 1.1fr 320px', gap: '20px', padding: '20px', maxWidth: '1600px', margin: '0 auto', paddingBottom: '80px' },
  leftCol: { display: 'flex', flexDirection: 'column', gap: '12px' },
  centerCol: { display: 'flex', flexDirection: 'column' },
  rightCol: { display: 'flex', flexDirection: 'column', gap: '14px' },
  fullContent: { padding: '20px', maxWidth: '900px', margin: '0 auto', paddingBottom: '80px' },
  colHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  colTitle: { margin: 0, fontSize: '15px', fontWeight: '700' },
  catchUpBtn: { background: 'linear-gradient(135deg, #004C54 0%, #00796B 100%)', border: 'none', borderRadius: '14px', padding: '6px 14px', fontSize: '11px', fontWeight: '600', color: '#fff', cursor: 'pointer' },
  momentsList: { display: 'flex', flexDirection: 'column', gap: '12px' },

  // Moment Card
  momentCard: { borderRadius: '12px', padding: '14px', borderLeft: '4px solid' },
  momentTop: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' },
  momentBadge: { fontSize: '9px', fontWeight: '800', padding: '3px 8px', borderRadius: '4px' },
  myTeamMomentBadge: { fontSize: '12px' },
  momentTime: { fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginLeft: 'auto' },
  momentReacting: { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: '#EF4444' },
  reactDot: { fontSize: '6px' },
  momentTitle: { margin: '0 0 4px', fontSize: '15px', fontWeight: '700' },
  momentDesc: { margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 },
  momentClip: { display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px', padding: '10px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '8px', cursor: 'pointer' },
  clipThumb: { width: '40px', height: '40px', borderRadius: '8px', border: '2px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', backgroundColor: 'rgba(0,0,0,0.3)' },
  clipMeta: { display: 'flex', flexDirection: 'column', gap: '2px' },
  clipDuration: { fontSize: '12px', fontWeight: '600' },
  clipViews: { fontSize: '10px', color: 'rgba(255,255,255,0.5)' },

  // Social Feed
  socialFeed: { backgroundColor: 'rgba(20,20,28,0.8)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', height: '100%', minHeight: '520px' },
  feedHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  feedTitle: { margin: 0, fontSize: '15px', fontWeight: '700' },
  feedLive: { fontSize: '9px', fontWeight: '700', color: '#10B981' },
  topicPills: { display: 'flex', gap: '8px', padding: '14px 18px', flexWrap: 'wrap', borderBottom: '1px solid rgba(255,255,255,0.04)' },
  topicPill: { border: '1px solid transparent', borderRadius: '16px', padding: '7px 14px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', background: 'transparent' },
  pillTeamIcon: { fontSize: '12px' },
  addTopicRow: { display: 'flex', gap: '8px', padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,0.04)' },
  addTopicInput: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '10px 14px', fontSize: '12px', color: '#fff', outline: 'none' },
  addTopicBtn: { width: '36px', backgroundColor: '#004C54', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '18px', cursor: 'pointer' },
  tweetStream: { flex: 1, overflow: 'auto', padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: '12px' },
  tweet: { padding: '12px 14px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '10px' },
  tweetHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' },
  tweetUser: { fontSize: '12px', fontWeight: '600', color: '#3B82F6', display: 'flex', alignItems: 'center', gap: '4px' },
  verified: { fontSize: '10px', color: '#1DA1F2' },
  tweetTime: { fontSize: '10px', color: 'rgba(255,255,255,0.4)' },
  tweetText: { margin: '0 0 8px', fontSize: '13px', lineHeight: 1.45, color: 'rgba(255,255,255,0.9)' },
  tweetLikes: { fontSize: '11px', color: 'rgba(255,255,255,0.4)' },

  // Widget Cards
  widgetCard: { backgroundColor: 'rgba(20,20,28,0.8)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)', padding: '14px' },
  widgetHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' },
  widgetTitleRow: { display: 'flex', alignItems: 'center', gap: '8px' },
  widgetIcon: { fontSize: '16px' },
  widgetTitle: { fontSize: '14px', fontWeight: '700' },
  widgetSubtitle: { fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '12px' },
  connectedBadge: { display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', color: '#10B981', backgroundColor: 'rgba(16,185,129,0.1)', padding: '4px 8px', borderRadius: '6px' },
  connectedDot: { fontSize: '6px' },

  // Players Card
  playersList: { display: 'flex', flexDirection: 'column', gap: '6px' },
  playerRow: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '8px' },
  playerDot: { width: '4px', height: '28px', borderRadius: '2px' },
  playerInfo: { flex: 1, display: 'flex', flexDirection: 'column', gap: '1px' },
  playerName: { fontSize: '12px', fontWeight: '600' },
  playerMeta: { fontSize: '10px', color: 'rgba(255,255,255,0.4)' },
  playerPoints: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end' },
  pointsNum: { fontSize: '16px', fontWeight: '800' },
  pointsTrend: { fontSize: '10px', fontWeight: '600' },

  // Bets Card
  betsList: { display: 'flex', flexDirection: 'column', gap: '6px' },
  betRow: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '8px' },
  betStatusDot: { width: '8px', height: '8px', borderRadius: '50%' },
  betInfo: { flex: 1, display: 'flex', flexDirection: 'column', gap: '1px' },
  betPick: { fontSize: '12px', fontWeight: '600' },
  betMeta: { fontSize: '10px', color: 'rgba(255,255,255,0.4)' },
  betStatus: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1px' },
  betStatusLabel: { fontSize: '10px', fontWeight: '700' },
  betNote: { fontSize: '9px', color: 'rgba(255,255,255,0.5)' },

  widgetFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', marginTop: '8px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '11px', color: 'rgba(255,255,255,0.5)' },
  footerValue: { color: '#10B981', fontWeight: '700' },
  footerValueLarge: { color: '#10B981', fontWeight: '800', fontSize: '16px' },

  // Reddit Widget
  redditMeta: { display: 'flex', gap: '12px', fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '12px' },
  redditPosts: { display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflow: 'auto' },
  redditPost: { padding: '10px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '8px' },
  redditPostHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '4px' },
  redditUser: { fontSize: '11px', fontWeight: '600', color: '#FF4500' },
  redditTime: { fontSize: '10px', color: 'rgba(255,255,255,0.4)' },
  redditText: { margin: '0 0 6px', fontSize: '12px', lineHeight: 1.4, color: 'rgba(255,255,255,0.9)' },
  redditPostFooter: { display: 'flex', alignItems: 'center', gap: '8px' },
  redditUpvotes: { fontSize: '10px', color: '#FF4500' },
  redditAward: { fontSize: '12px' },
  redditOpenBtn: { width: '100%', marginTop: '10px', padding: '10px', backgroundColor: 'rgba(255,69,0,0.1)', border: '1px solid rgba(255,69,0,0.2)', borderRadius: '8px', color: '#FF4500', fontSize: '12px', fontWeight: '600', cursor: 'pointer' },

  // Add Widget
  addWidgetCollapsed: { width: '100%', padding: '20px', backgroundColor: 'rgba(20,20,28,0.5)', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', transition: 'all 0.2s' },
  addWidgetPlus: { fontSize: '24px', color: 'rgba(255,255,255,0.3)' },
  addWidgetText: { fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontWeight: '500' },
  addWidgetExpanded: { backgroundColor: 'rgba(20,20,28,0.8)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)', padding: '16px' },
  addWidgetHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' },
  addWidgetTitle: { fontSize: '14px', fontWeight: '700' },
  addWidgetClose: { background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '16px', cursor: 'pointer' },
  addWidgetDesc: { fontSize: '11px', color: 'rgba(255,255,255,0.5)', margin: '0 0 14px' },
  widgetOptions: { display: 'flex', flexDirection: 'column', gap: '8px' },
  widgetOption: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '10px', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' },
  widgetOptionIcon: { width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' },
  widgetOptionInfo: { flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' },
  widgetOptionName: { fontSize: '13px', fontWeight: '600', color: '#fff' },
  widgetOptionDesc: { fontSize: '10px', color: 'rgba(255,255,255,0.5)' },
  widgetConnectedCheck: { fontSize: '14px', color: '#10B981' },
  widgetConnectBtn: { fontSize: '11px', fontWeight: '600', color: '#3B82F6', backgroundColor: 'rgba(59,130,246,0.1)', padding: '6px 12px', borderRadius: '6px' },

  comingSoon: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', fontSize: '24px', color: 'rgba(255,255,255,0.3)' },

  // Bottom Nav
  bottomNav: { position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(12,12,18,0.95)', backdropFilter: 'blur(16px)', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'center', gap: '8px', padding: '10px 24px', zIndex: 100 },
  navBtn: { border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '10px 36px', borderRadius: '12px', cursor: 'pointer', background: 'transparent' },
  navIcon: { fontSize: '20px' },
  navLabel: { fontSize: '11px', fontWeight: '600' },
};
