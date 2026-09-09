export type Game = 'BGMI' | 'Free Fire' | 'Esports'
export type Article = { id:string; slug:string; title:string; excerpt:string; image:string; game:Game; category:string; author:string; publishedAt:string; readingTime:string; tags:string[] }
export const articles: Article[] = [
{id:'1',slug:'bgms-season-5-final',title:'Nebula Esports Crowned BGMS Season 5 Champions After Dominant Grand Finals',excerpt:'Nebula Esports delivered a commanding performance in the grand finals to claim the championship and take home the top prize.',image:'/images/hero-esports.png',game:'BGMI',category:'Tournaments',author:'DROPZONE Editorial',publishedAt:'9 September 2026',readingTime:'6 min read',tags:['BGMS','Results','Nebula Esports']},
{id:'2',slug:'bgms-season-5-results',title:'BGMI Masters Series Season 5: Complete Results and Standings',excerpt:'The final leaderboard is set after 18 high-pressure matches in Mumbai.',image:'/images/bgmi-esports.png',game:'BGMI',category:'Results',author:'Aarav Mehta',publishedAt:'9 September 2026',readingTime:'5 min read',tags:['BGMI','Standings']},
{id:'3',slug:'team-x-roster-changes',title:'Team X Announces Major Roster Changes Ahead of New Season',excerpt:'A new-look lineup is ready to reset the competitive meta.',image:'/images/player-jonathan.png',game:'BGMI',category:'Teams',author:'Riya Kapoor',publishedAt:'8 September 2026',readingTime:'3 min read',tags:['Roster','Transfers']},
{id:'4',slug:'free-fire-new-format',title:'Free Fire India Tournament Reveals New Competition Format',excerpt:'The new format puts more weight on consistency, strategy and late-game calls.',image:'/images/freefire-esports.png',game:'Free Fire',category:'Tournaments',author:'Kabir Singh',publishedAt:'8 September 2026',readingTime:'4 min read',tags:['Free Fire','Format']},
{id:'5',slug:'global-championship-spot',title:'Indian Esports Team Secures Spot at Global Championship',excerpt:'A clutch final weekend sends India back to the international stage.',image:'/images/hero-esports.png',game:'Esports',category:'International',author:'DROPZONE Editorial',publishedAt:'7 September 2026',readingTime:'4 min read',tags:['India','Global']},
{id:'6',slug:'bgmi-update-explained',title:'New BGMI Update Brings Major Gameplay Changes',excerpt:'Here is what changes for competitive players in the latest patch.',image:'/images/bgmi-esports.png',game:'BGMI',category:'Updates',author:'Devika Rao',publishedAt:'6 September 2026',readingTime:'7 min read',tags:['Update','Guide']},
{id:'7',slug:'players-to-watch',title:'Top 10 Players to Watch in India’s Next Esports Season',excerpt:'The names expected to define the next chapter of Indian mobile esports.',image:'/images/player-jonathan.png',game:'Esports',category:'Players',author:'Aarav Mehta',publishedAt:'5 September 2026',readingTime:'8 min read',tags:['Players','Rankings']},
{id:'8',slug:'free-fire-returns',title:'Free Fire India Esports Returns With New Competitive Format',excerpt:'A fresh circuit promises more paths from ranked play to the main stage.',image:'/images/freefire-esports.png',game:'Free Fire',category:'Esports',author:'Kabir Singh',publishedAt:'4 September 2026',readingTime:'5 min read',tags:['Free Fire','Esports']},
{id:'9',slug:'bgmi-roster-watch',title:'The BGMI Roster Moves Already Shaping The New Season',excerpt:'Five transfers that could change the balance of power.',image:'/images/bgmi-esports.png',game:'BGMI',category:'Teams',author:'Riya Kapoor',publishedAt:'3 September 2026',readingTime:'4 min read',tags:['BGMI','Transfers']},
{id:'10',slug:'low-end-settings',title:'Free Fire Best Settings for Low-End Phones',excerpt:'A practical settings guide for smoother performance and better fights.',image:'/images/freefire-esports.png',game:'Free Fire',category:'Guides',author:'Devika Rao',publishedAt:'2 September 2026',readingTime:'6 min read',tags:['Settings','Tips']},
]
export const players = [{name:'Jonathan',game:'BGMI',team:'Team X',stat:'3 Championships',slug:'jonathan',image:'/images/player-jonathan.png'},{name:'Scout',game:'BGMI',team:'GodLike',stat:'2 MVP Awards',slug:'scout',image:'/images/player-jonathan.png'},{name:'Mortal',game:'BGMI',team:'S8UL',stat:'4 Grand Finals',slug:'mortal',image:'/images/player-jonathan.png'},{name:'Spower',game:'BGMI',team:'iQOO Orangutan',stat:'1.42 K/D',slug:'spower',image:'/images/player-jonathan.png'},{name:'Goblin',game:'BGMI',team:'Gladiators',stat:'1,240 Eliminations',slug:'goblin',image:'/images/player-jonathan.png'},{name:'Mavi',game:'BGMI',team:'Team X',stat:'7 LAN Finals',slug:'mavi',image:'/images/player-jonathan.png'}]
export const teams = [{name:'Nebula Esports',game:'BGMI',country:'India',slug:'nebula-esports',members:5,stat:'182 pts'},{name:'Gladiators Esports',game:'BGMI',country:'India',slug:'gladiators-esports',members:5,stat:'171 pts'},{name:'iQOO Orangutan',game:'BGMI',country:'India',slug:'iqoo-orangutan',members:5,stat:'164 pts'},{name:'Team X',game:'BGMI',country:'India',slug:'team-x',members:5,stat:'157 pts'},{name:'S8UL',game:'Esports',country:'India',slug:'s8ul',members:6,stat:'12 titles'},{name:'Total Gaming',game:'Free Fire',country:'India',slug:'total-gaming',members:5,stat:'8 titles'}]
export const tournaments = [{name:'BGMI Masters Series Season 5',game:'BGMI',status:'COMPLETED',date:'Aug 18 — Sep 9, 2026',prize:'₹1 Crore',slug:'bgms-season-5'},{name:'BGMI India Championship',game:'BGMI',status:'UPCOMING',date:'October 2026',prize:'₹50 Lakh',slug:'bgmi-india-championship'},{name:'Free Fire India Series',game:'Free Fire',status:'UPCOMING',date:'November 2026',prize:'₹35 Lakh',slug:'free-fire-india-series'},{name:'Mobile Esports Open',game:'Esports',status:'UPCOMING',date:'December 2026',prize:'₹20 Lakh',slug:'mobile-esports-open'}]
export const standings = [{rank:1,team:'Nebula Esports',matches:18,points:182},{rank:2,team:'Gladiators Esports',matches:18,points:171},{rank:3,team:'iQOO Orangutan',matches:18,points:164},{rank:4,team:'Team X',matches:18,points:157},{rank:5,team:'Team Y',matches:18,points:151}]
export const nav = [['Home','/'],['BGMI','/bgmi'],['Free Fire','/free-fire'],['Esports','/esports'],['Tournaments','/tournaments'],['Players','/players'],['Teams','/teams'],['Guides','/guides']]
export const aiQueue = [{source:'Esports Insider',headline:'New Indian BGMI Tournament Announced',confidence:'94%',risk:'Low',category:'BGMI / Tournament',status:'Pending review'},{source:'Sportskeeda',headline:'Team X confirms two roster changes',confidence:'91%',risk:'Medium',category:'BGMI / Teams',status:'Pending review'},{source:'Community desk',headline:'Free Fire India circuit returns this winter',confidence:'89%',risk:'Low',category:'Free Fire / Esports',status:'Approved'}]
export const adminArticles = articles.map((a,i)=>({...a,status:i%4===0?'Draft':'Published',views:`${(12+i*7).toFixed(0)}.${i}K`}))
export const getArticle = (slug:string) => articles.find(a=>a.slug===slug) ?? articles[0]
export const getPlayer = (slug:string) => players.find(p=>p.slug===slug) ?? players[0]
export const getTeam = (slug:string) => teams.find(t=>t.slug===slug) ?? teams[0]
export const getTournament = (slug:string) => tournaments.find(t=>t.slug===slug) ?? tournaments[0]

export const articleBody = ['The final circle had barely settled when Nebula Esports knew they had done enough. Across three days of relentless competition, the roster played with a rare combination of patience and precision.', 'The championship was shaped by small decisions: a patient rotate through the eastern ridge, a late smoke wall in the fifth match and a final push that turned a narrow deficit into a decisive win.', 'For the squad, this result is more than a trophy. It is proof that a disciplined identity can survive the pressure of a packed LAN final and a leaderboard that never stopped moving.']

export const categories = ['All News','Esports','Tournaments','Updates','Guides']
export const guides = articles.filter(a=>a.category==='Guides' || a.tags.includes('Guide')).concat([{...articles[1],id:'guide-1',slug:'best-bgmi-sensitivity',title:'Best BGMI Sensitivity Settings for Competitive Play',category:'Guides'},{...articles[3],id:'guide-2',slug:'close-range-aim',title:'How to Improve Your Close-Range Aim',category:'Guides'}])
export const trending = ['BGMS Season 5 Grand Finals','New BGMI Update','Free Fire India Tournament','Major Indian Esports Transfer']
export const searchResults = articles.slice(0,6)
export const stats = [{label:'Articles',value:'1,248',detail:'+18% this month'},{label:'Published',value:'892',detail:'71% of total'},{label:'Pending Review',value:'24',detail:'Needs attention'},{label:'Sources',value:'38',detail:'6 active today'}]
export const latestTournament = tournaments[0]
export const featured = articles[0]
export const latest = articles.slice(1,7)
export const bgmi = articles.filter(a=>a.game==='BGMI')
export const freeFire = articles.filter(a=>a.game==='Free Fire')
export const esports = articles.filter(a=>a.game==='Esports' || a.category==='International')
export const related = articles.slice(3,6)
export const pages = ['About DROPZONE','Contact','Privacy','Terms']
export type NavItem = typeof nav[number]

export const articleContent = {keyTakeaways:['Nebula Esports won the championship','Gladiators Esports finished second','Prize pool was ₹1 crore','18 matches were played'],moments:['A flawless opening day set the tone','The mid-event reset changed the title race','A composed final rotation sealed the trophy']}

export const getCollection = (slug:string) => slug==='bgmi'?bgmi:slug==='free-fire'?freeFire:esports

export const profileStats = [{label:'Matches',value:'486'},{label:'Wins',value:'82'},{label:'MVPs',value:'37'},{label:'Titles',value:'3'}]
export const teamResults = [{event:'BGMS Season 5',result:'1st Place',date:'Sep 2026'},{event:'India Championship',result:'3rd Place',date:'Jul 2026'},{event:'Pro League Split 2',result:'2nd Place',date:'May 2026'}]
export const navAdmin = [['Dashboard','/admin'],['Articles','/admin/articles'],['Sources','#'],['AI Queue','/admin/ai-queue'],['Players','#'],['Teams','#'],['Tournaments','#'],['Settings','#']]

export const relatedStats = [{label:'Champion',value:'Nebula Esports'},{label:'Matches played',value:'18'},{label:'Prize pool',value:'₹1 Crore'}]

export const emptyCopy = {title:'No stories found',body:'Try searching for another player, team or game.'}

export const articleMeta = {description:'DROPZONE is India’s esports news hub for BGMI, Free Fire and competitive gaming.',updatedAt:'9 September 2026'}

export const footerGroups = [{title:'Games',items:['BGMI','Free Fire','Esports']},{title:'Explore',items:['Tournaments','Players','Teams','Guides']},{title:'Company',items:['About','Contact','Privacy','Terms']}]

export const allSlugs = articles.map(a=>a.slug)

export const placeholderSource = {name:'Example Esports News',url:'#'}

export const dashboardSections = ['Dashboard','Content','Editorial','Community']

export const topStories = articles.slice(0,4)

export const teamMembers = ['Player A','Player B','Player C','Player D','Player E']

export const tournamentMatches = [{match:'Grand Final · Match 18',winner:'Nebula Esports',score:'24 — 18'},{match:'Grand Final · Match 17',winner:'Gladiators Esports',score:'19 — 17'},{match:'Semifinal · Match 12',winner:'Nebula Esports',score:'21 — 15'}]

export const contentTypes = ['News','Players','Teams','Tournaments']

export const popularPlayers = players.slice(0,4)

export const latestUpdates = articles.slice(6,10)

export const teamNews = articles.slice(2,5)

export const publicationNavigation = nav

export const seoDefaults = {title:'DROPZONE — India’s Esports News Hub',description:'Premium coverage of BGMI, Free Fire and Indian esports.'}

export const gameDescriptions = {BGMI:'Everything happening in India’s biggest mobile esports scene.', 'Free Fire':'Latest news, tournaments, updates and stories.', Esports:'The people, teams and moments shaping Indian esports.'}

export const profileBio = 'Jonathan is one of India’s most consistent competitive BGMI players, known for calm late-game calls and fearless close-range fights.'

export const teamBio = 'Nebula Esports is a championship-minded Indian BGMI organization built around preparation, composure and team-first play.'

export const tournamentDescription = 'The fifth season of the BGMI Masters Series brought India’s best teams together for 18 matches of high-pressure competition.'

export const adminFilters = ['All','Published','Draft','Pending','Rejected']

export const sourceNames = ['Esports Insider','Sportskeeda','Community desk','Official tournament desk']

export const allTags = ['BGMI','Free Fire','Esports','Tournaments','Results','Teams','Players','Guides','Updates','Transfers']

export const adminNav = navAdmin

export const storyCount = articles.length

export const lastUpdated = 'Updated 9 Sep 2026'

export const matchCount = 18

export const placement = '1st Place'

export const country = 'India'

export const heroTitle = featured.title

export const siteName = 'DROPZONE'

export const siteTagline = "India's Esports News Hub"

export const accent = '#C7FF2F'

export const year = 2026

export const statusLabels = ['COMPLETED','UPCOMING','LIVE']

export const adminTitle = 'Editorial control room'

export const sourcePlaceholder = 'Original report: Example Esports News'

export const queryPlaceholder = 'Search BGMI, Free Fire, players, teams...'

export const articleCategories = ['Breaking','Tournaments','Teams','Players','Updates','Guides']

export const menuItems = nav

export const mobileMenu = [['Home','/'],['BGMI','/bgmi'],['Free Fire','/free-fire'],['Esports','/esports'],['Tournaments','/tournaments'],['Players','/players'],['Teams','/teams'],['Guides','/guides']]

export const readMore = 'Read Full Story'

export const newsletterCopy = 'Get the sharpest stories in Indian esports, delivered once a week.'

export const editorialNote = 'Independent coverage. Clear context. No noise.'

export const siteDescription = 'DROPZONE is an independent esports publication focused on bringing Indian gamers the latest news, tournament updates, player stories and esports information.'

export const contactEmails = {editorial:'editorial@dropzone.gg',business:'business@dropzone.gg',partnerships:'partners@dropzone.gg'}

export const articleSlug = 'bgms-season-5-final'

export const mainImage = '/images/hero-esports.png'

export const generatedImages = ['/images/hero-esports.png','/images/bgmi-esports.png','/images/freefire-esports.png','/images/player-jonathan.png']

export const colorTokens = {background:'#08090B',surface:'#101216',surface2:'#16181D',border:'#272A31',text:'#F5F5F5',muted:'#969AA3',accent:'#C7FF2F'}

export const currentDate = '9 September 2026'

export const articleCount = '20+'

export const playerCount = '8'

export const teamCount = '6'

export const tournamentCount = '5'

export const tagCount = '10'

export const adminMetrics = stats

export const navLinks = nav

export const footerLinks = footerGroups

export const featuredArticle = featured

export const articleList = articles

export const playerList = players

export const teamList = teams

export const tournamentList = tournaments

export const standingsRows = standings

export const guideList = guides

export const queueItems = aiQueue

export const storyBody = articleBody

export const contactCopy = 'Tell us what you are building, covering or playing. Our editorial desk usually responds within two business days.'

export const aboutSections = [{title:'What We Cover',body:'BGMI, Free Fire, tournament results, player moves, guides and the stories behind Indian esports.'},{title:'Our Editorial Approach',body:'We value context over noise, clear sourcing over hot takes, and the communities that make these games matter.'},{title:'Contact',body:'Reach our desk for tips, corrections, partnerships or editorial ideas.'}]

export const updated = articleMeta.updatedAt

export const publication = {name:siteName,tagline:siteTagline}

export const featuredCategory = 'BGMI • ESPORTS'

export const footerDescription = "India's esports news hub for BGMI, Free Fire and competitive gaming."

export const socialLinks = ['Instagram','YouTube','X','Discord']

export const filters = categories

export const pageTitles = {home:'The pulse of Indian esports.',bgmi:'BGMI',freeFire:'FREE FIRE',esports:'INDIAN ESPORTS'}

export const adminKpis = ['Total Articles','Published','Pending Review','Sources']

export const reviewActions = ['Review','Edit','Publish','Reject']

export const articleTableColumns = ['Title','Game','Category','Status','Author','Published','Views']

export const articlePageTitle = 'Nebula Esports Crowned BGMS Season 5 Champions'

export const sourceCardTitle = 'SOURCE'

export const tableOfContents = ['The final circle','What changed the title race','Standings','What comes next']

export const breadcrumb = ['Home','BGMI','Tournaments','BGMS Season 5']

export const relatedNews = related

export const playerTabs = ['Overview','Stats','Results','News']

export const teamTabs = ['Overview','Results','Matches','News']

export const tournamentTabs = ['Overview','Standings','Matches','Teams','News']

export const searchFilters = ['All','News','Players','Teams','Tournaments']

export const guideCategories = ['BGMI Guides','Free Fire Guides','Settings','Tips','Updates','Beginner Guides']

export const loadingLabels = ['Loading article','Loading player','Loading tournament']

export const menuLabel = 'Open menu'

export const searchLabel = 'Open search'

export const closeLabel = 'Close menu'

export const newsletterLabel = 'Email address'

export const formFields = ['Name','Email','Subject','Message']

export const ariaLabels = {logo:'DROPZONE home',search:'Search',menu:'Open navigation'}

export const staticOnly = true

export const backendReady = true

export const mockDataNote = 'Static demo data prepared for future backend integration.'

export const noExternalData = true

export const contentModel = 'Article, Player, Team, Tournament, Game, Category, Tag, Source, Author'

export const articleModelFields = ['id','title','slug','excerpt','content','image','game','category','author','source','sourceUrl','publishedAt','updatedAt','readingTime','tags']

export const designSystem = {radius:'18px',font:'Geist',accent:'electric lime'}

export const buildVersion = 'v1.0 UI'

export const finalNote = 'Built as a premium editorial prototype.'

export const homeSections = ['Hero','Latest News','BGMI','Free Fire','Tournaments','Indian Esports','Trending Players','Latest Updates','Newsletter']

export const adminRoutes = ['/admin','/admin/articles','/admin/ai-queue']

export const publicRoutes = ['/','/bgmi','/free-fire','/esports','/tournaments','/players','/teams','/guides','/search','/about','/contact']

export const detailRoutes = ['/articles/bgms-season-5-final','/players/jonathan','/teams/nebula-esports','/tournaments/bgms-season-5']

export const allRoutes = [...publicRoutes,...detailRoutes,...adminRoutes]

export const isMock = true

export const copyright = '© 2026 DROPZONE. All rights reserved.'

export const privacyNote = 'Privacy'

export const termsNote = 'Terms'

export const notFoundTitle = 'Page not found'

export const notFoundBody = 'The story you are looking for moved off the drop.'

export const backHome = 'Back to home'

export const scoreline = '24 — 18'

export const teamChampion = 'Nebula Esports'

export const teamRunnerUp = 'Gladiators Esports'

export const prizePool = '₹1,00,00,000'

export const location = 'India'

export const tournamentStatus = 'COMPLETED'

export const featuredReadTime = '6 min read'

export const featuredDate = currentDate

export const headerNav = nav

export const drawerNav = mobileMenu

export const latestNewsTitle = 'The stories shaping Indian esports right now.'

export const cardVariants = ['large','medium','small','horizontal','featured']

export const heroLabel = 'FEATURED'

export const articleLayout = 'editorial'

export const mobileLayout = 'single-column'

export const desktopLayout = '1440px'

export const accessibility = true

export const responsive = true

export const futureBackendCompatible = true

export const end = true

export default {articles,players,teams,tournaments}
