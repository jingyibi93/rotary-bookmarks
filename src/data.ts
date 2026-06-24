import { Project, ProfileInfo } from './types';

export const INITIAL_PROFILE: ProfileInfo = {
  name: "Penny Bi",
  englishName: "Penny Bi",
  role: "独立设计师 & 建筑设计师 / Independent Designer & Architectural Designer",
  bio: "致力于在数字虚拟、物理实体与空间建构之间探寻重合点。通过极简主义平面排版、三维空间交互与档案式信息逻辑，重塑城市更新与设计媒介下的空间叙事。此微型旋转档案架是我长期收集的设计原型与核心作品的数字化复刻。",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80",
  contactEmail: "jingyibi93@gmail.com",
  socials: {
    github: "https://github.com",
    instagram: "https://instagram.com",
    dribbble: "https://dribbble.com",
    twitter: "https://twitter.com"
  }
};

export const INITIAL_PROJECTS: Project[] = [
  // ==================== DESIGN (Huafang Dormitory + OTHERS) ====================
  {
    id: "qiantan-31-cultural-center",
    title: "QUANTAN 31 CULTURAL CENTER / 前滩 31 文演中心",
    category: "Design",
    year: "2022",
    client: "Neri&Hu",
    description: "项目位于浦东前滩，建成后将成为中国最大的剧院之一，可容纳2500座。项目集酒店、办公、商业及剧院功能于一体，旨在为浦东居民带来全新的都市生活方式。",
    fullDetails: "Located at Qiantan, Pudong, the project is going to be one of the biggest theaters in China, with 2500 seats in total. Incorporating hotel, office, commercial functions and theater, the complex tries to bring new urban lifestyles to residents in Pudong. For the cultural center, an ancient word \"arena\" describes the audience experience within the building. And the theater hall echos to the concept of \"curtain\" that not only meets acoustic requirement but also brings a unique interior experience.\n\n项目位于浦东前滩，建成后将成为中国最大的剧院之一，可容纳2500座。项目集酒店、办公、商业及剧院功能于一体，旨在为浦东居民带来全新的都市生活方式。文化中心的设计灵感源于古语“arena”（竞技场/圆形剧场），用以描绘建筑内部的观演体验。剧院大厅则呼应“帷幕”的概念，既满足了声学要求，又营造出独特的内部空间体验。",
    thumbnail: "https://i.postimg.cc/jSnWQQDc/cover.jpg",
    gallery: [
      "https://i.postimg.cc/9XNF8w5s/1.jpg",
      "https://i.postimg.cc/1RY5CVhN/2.jpg",
      "https://i.postimg.cc/QMtjJjYL/3.jpg",
      "https://i.postimg.cc/GtRP6gyc/4.jpg",
      "https://i.postimg.cc/ZKCqTMRW/5.jpg",
      "https://i.postimg.cc/bvK99wYG/6.jpg",
      "https://i.postimg.cc/JnZc6Ctj/7.jpg",
      "https://i.postimg.cc/FKHDFHG0/8.jpg",
      "https://i.postimg.cc/28mxMn87/9.png"
    ],
    tags: ["文化地标", "剧院建筑", "Neri&Hu", "空间序事", "城市客厅"],
    accentColor: "#D97706",
    
    // CUSTOM VINTAGE ARCHITECTURE DOSSIER FIELDS
    subtitle: "Hotel and Entertainment Complex Design",
    projectType: "Hotel and Entertainment Complex Design",
    areaDetails: "GRAND THEATER SEATS: 2500 BLACK BOX: 1500m² TOTAL: 20000 m²",
    role: "Chief Designer at Neri&Hu",
    dateRange: "11/2019-04/2022",
    location: "Shanghai",
    contribution: "Schematic Design / DD Drawings / Coordination / FFE Design",
    designStatementEN: "Located at Qiantan, Pudong, the project is going to be one of the biggest theaters in China, with 2500 seats in total. Incorporating hotel, office, commercial functions and theater, the complex tries to bring new urban lifestyles to residents in Pudong. For the cultural center, an ancient word \"arena\" describes the audience experience within the building. And the theater hall echos to the concept of \"curtain\" that not only meets acoustic requirement but also brings a unique interior experience.",
    designStatementCN: "项目位于浦东前滩，建成后将成为中国最大的剧院之一，可容纳2500座。项目集酒店、办公、商业及剧院功能于一体，旨在为浦东居民带来全新的都市生活方式。文化中心的设计灵感源于古语“arena”（竞技场/圆形剧场），用以描绘建筑内部的观演体验。剧院大厅则呼应“帷幕”的概念，既满足了声学要求，又营造出独特的内部空间体验。"
  },
  {
    id: "huafang-dormitory",
    title: "HUAFANG DORMITORY RENOVATION / 华纺小区改造",
    category: "Design",
    year: "2021",
    client: "Neri&Hu",
    description: "“被重新发现的、非现代的废墟不仅是某种症候，更是进行意义探索与生产的新场域。” 该项目旨在原废弃的日式工厂宿舍区的废墟之上，构建一个新的城市目的地。其核心理念是打造一座“门径”，用以处理新旧之间的关系，为整个片区塑造出一个标志性的城市构筑物。",
    fullDetails: "“被重新发现的、非现代的废墟不仅是某种症候，更是进行意义探索与生产的新场域。” 该项目旨在原废弃的日式工厂宿舍区的废墟之上，构建一个新的城市目的地。其核心理念是打造一座“门径”，用以处理新旧之间的关系，为整个片区塑造出一个标志性的城市构筑物。\n\n“Rediscovered, off-modern ruins are not only symptoms but also sites for a new exploration and production of meanings.” The project aims to build a new urban destination on the ruins of an abandon dormitory compound of Japanese factory. The main idea is to create “Gateway” to deal with the relationship between old and new, shaping an urban artifact for the compound.",
    thumbnail: "https://i.postimg.cc/DyZ2kr35/20211216-Birdeye.jpg",
    gallery: [
      "https://i.postimg.cc/mZSDGZzC/20211220-Exterior-Perspective.jpg",
      "https://i.postimg.cc/dtM9gBCC/20211216-Perspective-1.jpg",
      "https://i.postimg.cc/bwh3STYg/20211216-Perspective-2.jpg",
      "https://i.postimg.cc/fWdc79r8/20211216-Perspective-3.jpg",
      "https://i.postimg.cc/yd09d7zD/3-1.jpg",
      "https://i.postimg.cc/vH69K8pQ/3-2.jpg",
      "https://i.postimg.cc/WbJrypQN/3-3.jpg",
      "https://i.postimg.cc/vZF9wFss/3-4.jpg",
      "https://i.postimg.cc/Dwks3kTd/3-5.jpg",
      "https://i.postimg.cc/x1vm0xfH/3-5-1.jpg",
      "https://i.postimg.cc/t4QPGQjh/3-5-2.jpg",
      "https://i.postimg.cc/jSHfsgxc/3-6.jpg"
    ],
    tags: ["城市更新", "历史建筑复活", "空间纽带", "日式厂房更新", "主创设计"],
    accentColor: "#171717",
    
    // CUSTOM VINTAGE ARCHITECTURE DOSSIER FIELDS
    subtitle: "Urban Renovation",
    projectType: "Practical Work (Government's Approval Stage)",
    areaDetails: "PLOT AREA: 4800m² BUILDING AREA: 8030m²",
    role: "Chief Designer",
    dateRange: "09/2020-12/2021",
    location: "Shanghai",
    contribution: "Concept Design\\Graphic Presentation\\Coordination",
    designStatementEN: '“Rediscovered, off-modern ruins are not only symptoms but also sites for a new exploration and production of meanings.” The project aims to build a new urban destination on the ruins of an abandon dormitory compound of Japanese factory. The main idea is to create “Gateway” to deal with the relationship between old and new, shaping an urban artifact for the compound.',
    designStatementCN: '“被重新发现的、非现代的废墟不仅是某种症候，更是进行意义探索与生产的新场域。” 该项目旨在原废弃的日式工厂宿舍区的废墟之上，构建一个新的城市目的地。其核心理念是打造一座“门径”，用以处理新旧之间的关系，为整个片区塑造出一个标志性的城市构筑物。'
  },
  {
    id: "the-culture-city",
    title: "THE CULTURE CITY / 文化都市",
    category: "Design",
    year: "2023",
    client: "AIM Architecture",
    description: "该项目邀请参观者开启一场文化漫步，体验多种类型的文化空间：商业集市式的文化中心、灵活的多功能文化场所，以及纯粹的文化空间。",
    fullDetails: "This project invites visitors to embark on a cultural promenade, where they will experience diverse typologies of cultural spaces: commercial marketplace-style cultural hubs, flexible multi-functional cultural venues, and pure cultural spaces.\n\n该项目邀请参观者开启一场文化漫步，体验多种类型的文化空间：商业集市式的文化中心、灵活的多功能文化场所，以及纯粹的文化空间。",
    thumbnail: "https://i.postimg.cc/wvTL4XdL/2-1.jpg",
    gallery: [
      "https://i.postimg.cc/MTYk1Tj4/L2-OPT2-2.jpg",
      "https://i.postimg.cc/MHZC5S76/L2-OPT2-3.jpg",
      "https://i.postimg.cc/WzpB8vG1/L2-OPT2-4.jpg",
      "https://i.postimg.cc/CM2kJnrQ/2-13.jpg",
      "https://i.postimg.cc/Y03FWJkv/6-1-PS.jpg",
      "https://i.postimg.cc/JzhNb4sM/6-2-PS.jpg",
      "https://i.postimg.cc/0Nn1hn8m/6-3-PS.jpg",
      "https://i.postimg.cc/y8hMSj35/6-4-PS.jpg",
      "https://i.postimg.cc/4yhM4QTL/6-5-PS.jpg",
      "https://i.postimg.cc/CLfD2M97/2-14.jpg",
      "https://i.postimg.cc/zXzKrXSg/6-1-2-PS.jpg",
      "https://i.postimg.cc/y8BV5kmK/6-2-2-PS.jpg",
      "https://i.postimg.cc/TPQbHzB3/6-3-2-PS.jpg",
      "https://i.postimg.cc/0jycBGVV/6-4-2-PS.jpg",
      "https://i.postimg.cc/hjBdvSxT/6-5-2.jpg"
    ],
    tags: ["文化都市", "文化漫步", "AIM", "空间体验", "深圳湾"],
    accentColor: "#4B5563",
    
    // CUSTOM VINTAGE ARCHITECTURE DOSSIER FIELDS
    subtitle: "Shenzhen Bay China Resources Cultural Plaza Interior Design",
    projectType: "Interior Design",
    areaDetails: "2000m²",
    role: "Chief Designer at AIM Architecture",
    dateRange: "03/2023-05/2023",
    location: "Shenzhen",
    contribution: "Concept Design\\Graphic Presentation",
    designStatementEN: "This project invites visitors to embark on a cultural promenade, where they will experience diverse typologies of cultural spaces: commercial marketplace-style cultural hubs, flexible multi-functional cultural venues, and pure cultural spaces.",
    designStatementCN: "该项目邀请参观者开启一场文化漫步，体验多种类型的文化空间：商业集市式的文化中心、灵活的多功能文化场所，以及纯粹的文化空间。"
  },
  {
    id: "niccolo-phuket-resort",
    title: "NICCOLO PHUKET RESORT / 尼依格罗普吉岛度假村",
    category: "Design",
    year: "2021",
    client: "Neri&Hu",
    description: "项目位于普吉岛——一个每年吸引大量游客到访的著名度假胜地。场地位于山顶，享有海景与林景的双重优势。为区分游客与旅者，整体设计聚焦于在后疫情时代营造归属感，吸引旅者来到这座“岛中之岛”，探索一种别致的生活方式。",
    fullDetails: "The project is located at Phuket where lots of tourists come every year as a famous resort destination. And the site has the advantage of both sea view and forest view on a hill peak. To differentiate tourists and travelers, the whole design focuses on bringing the sense of belonging in the post-pandemic era, which invites traveller to the island within island exploring a chic life.\n\n项目位于普吉岛——一个每年吸引大量游客到访的著名度假胜地。场地位于山顶，享有海景与林景的双重优势。为区分游客与旅者，整体设计聚焦于在后疫情时代营造归属感，吸引旅者来到这座“岛中之岛”，探索一种别致的生活方式。",
    thumbnail: "https://i.postimg.cc/Y216bCgF/20210714-Axon-morning-FOR.jpg",
    gallery: [
      "https://i.postimg.cc/J7kDRr5S/4-1.jpg",
      "https://i.postimg.cc/L8tPHC9t/4-2.jpg",
      "https://i.postimg.cc/8cBzW37h/20210713-PA-canopy-solid-gl.jpg",
      "https://i.postimg.cc/KcwVC2Zf/20210713-ADD-gl.jpg",
      "https://i.postimg.cc/MTc5YnjV/20210713-lobbyatrium.png",
      "https://i.postimg.cc/8CJkwsFT/20210713-poolbar-KH.jpg",
      "https://i.postimg.cc/bYGMJb7j/20210713-swimming-pool-gl.jpg",
      "https://i.postimg.cc/qq9zXnLD/20210713-grotto-view-2.jpg",
      "https://i.postimg.cc/yW4062w8/20210714-GR-Section.png"
    ],
    tags: ["度假村设计", "海景与林景", "Neri&Hu", "岛中之岛", "后疫情时代"],
    accentColor: "#0891B2",
    
    // CUSTOM VINTAGE ARCHITECTURE DOSSIER FIELDS
    subtitle: "Resort Design",
    projectType: "Resort Design",
    areaDetails: "PLOT AREA: 51100m² BUILDING AREA: 19774m²",
    role: "Chief Designer at Neri&Hu",
    dateRange: "11/2020-10/2021",
    location: "Phuket, Thailand",
    contribution: "Concept Design\\Graphic Presentation\\Coordination",
    designStatementEN: "The project is located at Phuket where lots of tourists come every year as a famous resort destination. And the site has the advantage of both sea view and forest view on a hill peak. To differentiate tourists and travelers, the whole design focuses on bringing the sense of belonging in the post-pandemic era, which invites traveller to the island within island exploring a chic life.",
    designStatementCN: "项目位于普吉岛——一个每年吸引大量游客到访的著名度假胜地。场地位于山顶，享有海景与林景的双重优势。为区分游客与旅者，整体设计聚焦于在后疫情时代营造归属感，吸引旅者来到这座“岛中之岛”，探索一种别致的生活方式。"
  },
  {
    id: "eagle-west-tower",
    title: "EAGLE+WEST TOWER / 西鹰大厦",
    category: "Design",
    year: "2018",
    client: "OMA New York",
    description: "项目坐落于绿点码头 D 区，两座楼分别采用退台金字塔造型及其倒置形态的塔楼彼此精准呼应。作为 OMA 纽约事务所在布鲁克林的首个落成建筑，该项目旨在激活滨水区的转型，将后工业时代的边缘地带转变为充满活力的社区。两座塔楼之间的空间框出一幅望向曼哈顿的全新视野，将为布鲁克林的天际线增添一道独特的风景。",
    fullDetails: "Located at Greenpoint Landing Block D, a ziggurat tower and its inverse tower carefully calibrated to one another. As OMA New York's first building in Brooklyn, the project aims to activate the transformation of the waterfront from a post-industrial edge to a vibrant neighborhood. The space between two towers frames a new view to Manhattan, which will bring a unique impact on the Brooklyn skyline.\n\n项目坐落于绿点码头 D 区，两座楼分别采用退台金字塔造型及其倒置形态的塔楼彼此精准呼应。作为 OMA 纽约事务所在布鲁克林的首个落成建筑，该项目旨在激活滨水区的转型，将后工业时代的边缘地带转变为充满活力的社区。两座塔楼之间的空间框出一幅望向曼哈顿的全新视野，将为布鲁克林的天际线增添一道独特的风景。",
    thumbnail: "https://i.postimg.cc/NGSnr4TL/6-3.jpg",
    gallery: [
      "https://i.postimg.cc/XY4fySDH/6-5.jpg",
      "https://i.postimg.cc/G90BRYZt/6-6.jpg",
      "https://i.postimg.cc/HWF3nNgZ/6-7.jpg",
      "https://i.postimg.cc/W16rwWks/6-4.jpg",
      "https://i.postimg.cc/fbWf1ncm/6-8.jpg"
    ],
    tags: ["退台金字塔", "OMA New York", "布鲁克林", "滨水转型", "天际线"],
    accentColor: "#1D4ED8",
    
    // CUSTOM VINTAGE ARCHITECTURE DOSSIER FIELDS
    subtitle: "Residential High-rise Design",
    projectType: "Residential High-rise Design",
    areaDetails: "PLOT AREA: 89030m² BUILDING AREA: 110711m²",
    role: "Intern at OMA New York",
    dateRange: "06/2018-08/2018",
    location: "Brooklyn, U.S.",
    contribution: "Massing Study\\Model Making\\Logo Design\\Facade Study",
    designStatementEN: "Located at Greenpoint Landing Block D, a ziggurat tower and its inverse tower carefully calibrated to one another. As OMA New York's first building in Brooklyn, the project aims to activate the transformation of the waterfront from a post-industrial edge to a vibrant neighborhood. The space between two towers frames a new view to Manhattan, which will bring a unique impact on the Brooklyn skyline.",
    designStatementCN: "项目坐落于绿点码头 D 区，两座楼分别采用退台金字塔造型及其倒置形态的塔楼彼此精准呼应。作为 OMA 纽约事务所在布鲁克林的首个落成建筑，该项目旨在激活滨水区的转型，将后工业时代的边缘地带转变为充满活力的社区。两座塔楼之间的空间框出一幅望向曼哈顿的全新视野，将为布鲁克林的天际线增添一道独特的风景。"
  },
  {
    id: "zootopia",
    title: "ZOOTOPIA / 动物世界",
    category: "Design",
    year: "2015",
    client: "Undergraduate Academic",
    description: "大多数公共空间都禁止宠物入内。人们在寻求构建环保建筑的同时，也必须考虑动物的需求。让建筑与周遭环境——即动物与自然——融为一体至关重要。试着想象，如果能够将动物的需求与人的需求相结合，我们就能为社区营造出更加生动鲜活的生活场景。",
    fullDetails: "Most public spaces must ban pets in. People in search of the construction of environmentally friendly buildings, at the same time, must consider the needs of animals. It is important to make the building blend in with the surrounding: animals and nature. Trying to imagine that if we can combine animals' needs with people's needs, we can create a more vivid life scenario for the community.\n\n大多数公共空间都禁止宠物入内。人们在寻求构建环保建筑的同时，也必须考虑动物的需求。让建筑与周遭环境——即动物与自然——融为一体至关重要。试着想象，如果能够将动物的需求与人的需求相结合，我们就能为社区营造出更加生动鲜活的生活场景。",
    thumbnail: "https://i.postimg.cc/bNc6w50Q/zootopia-da.jpg",
    gallery: [
      "https://i.postimg.cc/yNKXZf7b/7-4.jpg",
      "https://i.postimg.cc/5tVsb4Tb/7-5.jpg",
      "https://i.postimg.cc/8z4hRK2d/7-3.png",
      "https://i.postimg.cc/L8Whd5bZ/7-2.jpg",
      "https://i.postimg.cc/SKW4ZKF0/7-1.jpg",
      "https://i.postimg.cc/1XTJGWbs/zoo2.jpg",
      "https://i.postimg.cc/J7ygnJfz/zoo3.jpg",
      "https://i.postimg.cc/cLsghb5k/Screen-Shot-2026-06-01-151427-802.jpg"
    ],
    tags: ["社区设计", "人宠共生", "环保建筑", "自然共存", "学术研究"],
    accentColor: "#047857",
    
    // CUSTOM VINTAGE ARCHITECTURE DOSSIER FIELDS
    subtitle: "Community Facility Design",
    projectType: "Community Facility Design",
    areaDetails: "ADVISOR: Ching-Ling Huang",
    role: "Individual",
    dateRange: "03/2015-05/2015",
    location: "Taipei",
    contribution: "Concept Design\\Academic Research",
    designStatementEN: "Most public spaces must ban pets in. People in search of the construction of environmentally friendly buildings, at the same time, must consider the needs of animals. It is important to make the building blend in with the surrounding: animals and nature. Trying to imagine that if we can combine animals' needs with people's needs, we can create a more vivid life scenario for the community.",
    designStatementCN: "大多数公共空间都禁止宠物入内。人们在寻求构建环保建筑的同时，也必须考虑动物的需求。让建筑与周遭环境——即动物与自然——融为一体至关重要。试着想象，如果能够将动物的需求与人的需求相结合，我们就能为社区营造出更加生动鲜活的生活场景。"
  },
  {
    id: "museum-island",
    title: "MUSEUM ISLAND / 博物馆岛",
    category: "Design",
    year: "2018",
    client: "Graduate Academic",
    description: "提到博物馆，许多项目往往聚焦于展览空间的空间感受。而该项目位于梅尼尔收藏园区，将着重呈现展品与存储空间组织之间的关系。项目采用模块化的木结构体系，通过每层模块的不同朝向，赋予了建筑灵活性与统一性。",
    fullDetails: "When it comes to museums, many projects will focus on the spatial feeling of exhibition spaces. Located at Menil Collection Campus, this project will highlight the relationship between exhibits and organization of storage space. By using module, the project has a method of timber structure. The different directions of module on each level give both flexibility and unity to the building.\n\n提到博物馆，许多项目往往聚焦于展览空间的空间感受。而该项目位于梅尼尔收藏园区，将着重呈现展品与存储空间组织之间的关系。项目采用模块化的木结构体系，通过每层模块的不同朝向，赋予了建筑灵活性与统一性。",
    thumbnail: "https://i.postimg.cc/6pMv27Zc/8-2.jpg",
    gallery: [
      "https://i.postimg.cc/5NxmyKNh/8-12.jpg",
      "https://i.postimg.cc/5N3HTHnB/8-6.jpg",
      "https://i.postimg.cc/jdKwM6Qf/8-4.jpg",
      "https://i.postimg.cc/KvFk07rr/8-5.jpg",
      "https://i.postimg.cc/xTRkhktF/8-7.jpg",
      "https://i.postimg.cc/rFnV55fP/8-8.jpg",
      "https://i.postimg.cc/7YW45w6L/8-9.jpg",
      "https://i.postimg.cc/nVdbWpq3/8-10.jpg",
      "https://i.postimg.cc/Y00V7LQY/8-11.jpg",
      "https://i.postimg.cc/Mp6Bp0vP/8-0.jpg",
      "https://i.postimg.cc/50CYRnRn/8-1.jpg"
    ],
    tags: ["博物馆设计", "梅尼尔收藏园区", "木结构体系", "模块化空间"],
    accentColor: "#B45309",
    
    // CUSTOM VINTAGE ARCHITECTURE DOSSIER FIELDS
    subtitle: "Museum Design",
    projectType: "Museum Design",
    areaDetails: "ADVISOR: Mark Lee & Sharon Johnston",
    role: "Individual",
    dateRange: "02/2018-05/2018",
    location: "Houston, U.S.",
    contribution: "Thesis Design\\Structural Study",
    designStatementEN: "When it comes to museums, many projects will focus on the spatial feeling of exhibition spaces. Located at Menil Collection Campus, this project will highlight the relationship between exhibits and organization of storage space. By using module, the project has a method of timber structure. The different directions of module on each level give both flexibility and unity to the building.",
    designStatementCN: "提到博物馆，许多项目往往聚焦于展览空间的空间感受。而该项目位于梅尼尔收藏园区，将着重呈现展品与存储空间组织之间的关系。项目采用模块化的木结构体系，通过每层模块的不同朝向，赋予了建筑灵活性与统一性。"
  },
  {
    id: "diverse-city",
    title: "DIVERSE CITY / 多元城市",
    category: "Design",
    year: "2016",
    client: "Undergraduate Academic",
    description: "随着厦门的发展，厦门本岛日益拥挤，城市人口正逐步向郊区迁移。位于杏林湾内海区域的场地已成为新的城市目的地。杏林湾新区的城市设计通过打造多样尺度的街区，并让自然元素有机融入场地，旨在构建一座多元化的城市。",
    fullDetails: "With the development of Xiamen, the Xiamen Island is becoming more and more crowded, and the urban population is migrating to the suburbs. Site located at Xinglin Bay inland sea area has become a new city destination. The Xinglin Bay New District urban design created a variety of scale blocks and a natural invasion of the site in order to create a diverse city. Through the streamline slow-moving trail series, different open spaces are combined to provide more possibilities for life.\n\n随着厦门的发展，厦门本岛日益拥挤，城市人口正逐步向郊区迁移。位于杏林湾内海区域的场地已成为新的城市目的地。杏林湾新区的城市设计通过打造多样尺度的街区，并让自然元素有机融入场地，旨在构建一座多元化的城市。通过流畅的慢行步道系统，不同的开放空间被串联起来，为生活提供了更多可能性。",
    thumbnail: "https://i.postimg.cc/MGN2GDp8/14-4.jpg",
    gallery: [
      "https://i.postimg.cc/VkFk523Z/14-2.jpg",
      "https://i.postimg.cc/rwyLZsP4/14-3.jpg",
      "https://i.postimg.cc/2SxS3gPc/14-1.jpg"
    ],
    tags: ["城市设计", "多元城市", "慢行步道", "厦门杏林湾", "学术研究"],
    accentColor: "#0284C7",
    
    // CUSTOM VINTAGE ARCHITECTURE DOSSIER FIELDS
    subtitle: "DIVERSE CITY",
    projectType: "Urban Design",
    areaDetails: "ADVISOR: Yaopeng Li",
    role: "Partner with Hanjie Huang",
    dateRange: "03/2016-05/2016",
    location: "Xiamen",
    contribution: "Site Analysis\\Form Design\\Diagram Drawing\\Modeling\\Rendering",
    designStatementEN: "With the development of Xiamen, the Xiamen Island is becoming more and more crowded, and the urban population is migrating to the suburbs. Site located at Xinglin Bay inland sea area has become a new city destination. The Xinglin Bay New District urban design created a variety of scale blocks and a natural invasion of the site in order to create a diverse city. Through the streamline slow-moving trail series, different open spaces are combined to provide more possibilities for life.",
    designStatementCN: "随着厦门的发展，厦门本岛日益拥挤，城市人口正逐步向郊区迁移。位于杏林湾内海区域的场地点已成为新的城市目的地。杏林湾新区的城市设计通过打造多样尺度的街区，并让自然元素有机融入场地，旨在构建一座多元化的城市。通过流畅的慢行步道系统，不同的开放空间被串联起来，为生活提供了更多可能性。"
  },
  {
    id: "joints",
    title: "JOINTS / 连接之处",
    category: "Design",
    year: "2018",
    client: "Graduate Academic",
    description: "在工业革命之前，以家为基地的工作曾是主流的劳动方式。据说在英国，有25%的人居住在办公场所，这意味着一种新型的居住与工作革命正在到来。该项目主要探索如何将传统的工业生产与居家办公相结合，并将工厂融入到社会住宅之中。",
    fullDetails: "House-based work was the dominant working practice until industrial revolution. It is said that in UK, 25% of people live at their workplace, which means a new type of living and working revolution is coming. Furniture somehow defines our lifestyles and the occupation of space. How to combine traditional industrial production with new era of home-based working is the main idea of my project. Making the process of production visible not only to residents but also to urban is a main strategy to incorporate factories with social housing.\n\n在工业革命之前，以家为基地的工作曾是主流的劳动方式。据说在英国，有25%的人居住在办公场所，这意味着一种新型的居住与工作革命正在到来。家具在某种程度上定义着我们的生活方式以及对空间的占用。如何将传统的工业生产与居家办公的新时代相结合，是我项目的核心构想。让生产过程不仅对居民可见，也对城市可见，是将工厂与社会住宅相结合的主要策略。",
    thumbnail: "https://i.postimg.cc/Cx2tjpRg/9-1.jpg",
    gallery: [
      "https://i.postimg.cc/J0KkNtg1/9-4.jpg",
      "https://i.postimg.cc/hPPxSbzD/9-5.png",
      "https://i.postimg.cc/4xHYd8Jf/9-6.png",
      "https://i.postimg.cc/xj7zDsNv/9-6-1.jpg",
      "https://i.postimg.cc/3wMdDgRx/9-7.png",
      "https://i.postimg.cc/Wp0SDn1g/9-2.jpg",
      "https://i.postimg.cc/rm1WpfNk/9-3.jpg",
      "https://i.postimg.cc/rFSpmmvv/wei-xin-tu-pian-20260604161035-203-71.jpg"
    ],
    tags: ["社会住宅", "居家办公", "Alison Brooks", "伦敦设计", "空间革新"],
    accentColor: "#9A3412",
    
    subtitle: "JOINTS",
    projectType: "Public Housing Design",
    areaDetails: "ADVISOR: Alison Brooks",
    role: "Individual",
    dateRange: "09/2018-12/2018",
    location: "London, U.K.",
    contribution: "Concept Design\\Academic Research\\Technical Drawings",
    designStatementEN: "House-based work was the dominant working practice until industrial revolution. It is said that in UK, 25% of people live at their workplace, which means a new type of living and working revolution is coming. Furniture somehow defines our lifestyles and the occupation of space. How to combine traditional industrial production with new era of home-based working is the main idea of my project. Making the process of production visible not only to residents but also to urban is a main strategy to incorporate factories with social housing.",
    designStatementCN: "在工业革命之前，以家为基地的工作曾是主流的劳动方式。据说在英国，有25%的人居住在办公场所，这意味着一种新型的居住与工作革命正在到来。家具在某种程度上定义着我们的生活方式以及对空间的占用。如何将传统的工业生产与居家办公的新时代相结合，是我项目的核心构想。让生产过程不仅对居民可见，也对城市可见，是将工厂与社会住宅相结合的主要策略。"
  },
  {
    id: "hub",
    title: "HUB / 城市枢纽",
    category: "Design",
    year: "2015",
    client: "Undergraduate Academic",
    description: "城市中的办公空间与公共休闲空间不应被明确界定。在新社会背景下，通勤办公者与高层办公楼之间的关系已不仅局限于工作时间。该设计通过公共空间的介入，不仅创造了多样化的办公空间，也为公众提供了一个连接厦门新旧城区的良好枢纽。",
    fullDetails: "The office space in the city and the public leisure space should not be clearly defined. The relationship between the office commuter and the high-rise office building in the new society is not just limited to working hours. Through the invasion of public space, the design not only created a diverse working space but also provided a good hub to connect the old and the new of Xiamen for the public.\n\n城市中的办公空间与公共休闲空间不应被明确界定。在新社会背景下，通勤办公者与高层办公楼之间的关系已不仅局限于工作时间。通过公共空间的介入，该设计不仅创造了多样化的办公空间，也为公众提供了一个连接厦门新旧城区的良好枢纽。",
    thumbnail: "https://i.postimg.cc/DzdyJHHC/10-1.jpg",
    gallery: [
      "https://i.postimg.cc/cCJHNhDz/10-2.png",
      "https://i.postimg.cc/G2L3kz1t/10-6.jpg",
      "https://i.postimg.cc/QMbhx5WL/10-4.jpg",
      "https://i.postimg.cc/TPqYLFFr/10-3.png",
      "https://i.postimg.cc/xCfjKgSL/10-7.jpg",
      "https://i.postimg.cc/P5HqXdFS/10-11.jpg",
      "https://i.postimg.cc/BQH6fjNf/10-8.jpg",
      "https://i.postimg.cc/52m2jDZL/10-9.jpg",
      "https://i.postimg.cc/pLvdWP12/10-10.jpg",
      "https://i.postimg.cc/P5HqXdFS/10-11.jpg",
      "https://i.postimg.cc/R0QV6y2r/10-5.jpg"
    ],
    tags: ["高层建筑", "城市枢纽", "厦门旧城", "公共空间", "通勤社区"],
    accentColor: "#0369A1",
    
    subtitle: "HUB",
    projectType: "High-rise Design",
    areaDetails: "ADVISOR: Yi Hong",
    role: "Partner with Hanjie Huang",
    dateRange: "09/2015-11/2015",
    location: "Xiamen",
    contribution: "Site Analysis\\Form Design\\Diagram Drawing\\Modeling\\Rendering",
    designStatementEN: "The office space in the city and the public leisure space should not be clearly defined. The relationship between the office commuter and the high-rise office building in the new society is not just limited to working hours. Through the invasion of public space, the design not only created a diverse working space but also provided a good hub to connect the old and the new of Xiamen for the public.",
    designStatementCN: "城市中的办公空间与公共休闲空间不应被明确界定。在新社会背景下，通勤办公者与高层办公楼之间的关系已不仅局限于工作时间。通过公共空间的介入，该设计不仅创造了多样化的办公空间，也为公众提供了一个连接厦门新旧城区的良好枢纽。"
  },

  // ==================== ART ====================
  {
    id: "still-life",
    title: "STILL LIFE / 静物",
    category: "Art",
    year: "2018",
    client: "Academic Study at GSD",
    description: "在Jennifer Bonner指导下，与Xin Zheng合作进行的GSD学术设计课题，深入探究三维物体的静物形态、重力感知与空间材质转译。",
    fullDetails: "Academic Study at GSD / Graduate School of Design. Guided by Jennifer Bonner and in collaboration with Xin Zheng, this still life research explores core geometric intersections and balance orientations.\n\nJennifer Bonner 指导，与 Xin Zheng 合作完成的学术小品研究。对静物的空间体量、重心与表面肌理纹路进行多轴向拼接，力求通过独特的建筑几何体块组合与实体模型，呈现日常静物在空间深渊中的非常态重力感。",
    thumbnail: "https://i.postimg.cc/XqF3PHfS/wei-xin-tu-pian-20260604161226-8555-46.jpg",
    gallery: [
      "https://i.postimg.cc/XqF3PHfS/wei-xin-tu-pian-20260604161226-8555-46.jpg",
      "https://i.postimg.cc/cHnV1Krk/wei-xin-tu-pian-20260604161038-206-71.jpg",
      "https://i.postimg.cc/59msBqd1/wei-xin-tu-pian-20260604161318-207-71.jpg"
    ],
    tags: ["静物几何", "微型搭建", "GSD学术", "Jennifer Bonner", "材质转译"],
    accentColor: "#71717A",
    
    subtitle: "Academic Study at GSD / 哈佛学术研究",
    projectType: "Academic Study / 学术研究",
    areaDetails: "Jennifer Bonner",
    role: "Collaborative Partner with Xin Zheng",
    dateRange: "10/2018",
    location: "Cambridge, Massachusetts",
    contribution: "Concept, Physical Model & Graphic Presentation",
    designStatementEN: "Academic Study at GSD / Graduate School of Design. Guided by Jennifer Bonner and in collaboration with Xin Zheng, this still life research explores core geometric intersections and balance orientations.",
    designStatementCN: "在Jennifer Bonner指导下，与Xin Zheng合作进行的GSD学术设计课题，深入探究三维物体的静物形态、重心与空间材质转译。"
  },
  {
    id: "burrow-tower",
    title: "BURROW TOWER / 掘塔",
    category: "Art",
    year: "2018",
    client: "Academic Study at GSD",
    description: "在Andrew Witt指导下，与Xin Zheng合作开展的哈佛大学GSD设计探索，旨在通过对复杂多孔体量和地底挖掘结构的计算式几何重构，探讨新型垂直建筑学形态。",
    fullDetails: "Academic Study at GSD, in collaboration with Xin Zheng and guided by Andrew Witt, investigating voxelized subtractive architectural logic, porous subterranean towers and intricate carved network systems.\n\n在 Andrew Witt 指导下与 Xin Zheng 合作完成的学术设计探索。研究由内向外、由上至下的挖掘式（Subtractive）空间生成逻辑，在原本密实的体量中剥离、啃啮出连续复杂的网状孔穴与腔面体系。这一研究挑战了传统结构搭建和立面生成的概念，呈现了垂直塔楼的另一重地底化、孔洞化图景。",
    thumbnail: "https://i.postimg.cc/TPSVHVWr/20250504-portfolio.jpg",
    gallery: [
      "https://i.postimg.cc/TPSVHVWr/20250504-portfolio.jpg"
    ],
    tags: ["多孔性巨构", "三维雕凿几何", "GSD计算式语法", "Andrew Witt", "空间网穴"],
    accentColor: "#1E293B",
    
    subtitle: "Academic Study at GSD / 计算生成塔楼研究",
    projectType: "Academic Study / 计算式空间形态研究",
    areaDetails: "Andrew Witt",
    role: "Collaborative Partner with Xin Zheng",
    dateRange: "02/2018-05/2018",
    location: "Cambridge, Massachusetts",
    contribution: "Porous Voxel Generation, Section Draw & Graphic Layout",
    designStatementEN: "Academic Study at GSD, in collaboration with Xin Zheng and guided by Andrew Witt, investigating voxelized subtractive architectural logic, porous subterranean towers and intricate carved network systems.",
    designStatementCN: "在Andrew Witt指导下，与Xin Zheng合作开展的哈佛大学GSD设计探索，旨在通过对复杂多孔体量和地底挖掘结构的计算式几何重构，探讨新型垂直建筑学形态。"
  },
  {
    id: "bamboo-pavilion",
    title: "BAMBOO PAVILION / 孟加拉竹构建造",
    category: "Art",
    year: "2017",
    client: "Academic Study at GSD",
    description: "项目为Marina Tabassum设计教学课题下的空间竹构原型研究。深耕于孟加拉本土材料 of 自然建造，发挥毛竹的拉韧性与编织构造，形成精美而兼具防晒屏蔽性能的轻质共享遮亭。",
    fullDetails: "Under the guidance of Marina Tabassum, this pavilion academic study explores tectonic systems using native bamboo stalks in Bangladesh, delivering custom space filters and localized visual shade.\n\n项目为Marina Tabassum设计教学课题下的空间竹构原型研究。深耕于孟加拉本土材料的自然建造，发挥毛竹的拉韧性与编织构造，形成精美而兼具防晒屏蔽性能的轻质共享遮亭。",
    thumbnail: "https://i.postimg.cc/mr5rYV1p/20170929-IMG-1709.jpg",
    gallery: [
      "https://i.postimg.cc/mr5rYV1p/20170929-IMG-1709.jpg"
    ],
    tags: ["地方竹构造", "本土技艺", "孟加拉现场", "传统编结", "装置建造性"],
    accentColor: "#15803D",
    
    subtitle: "Academic Study at GSD",
    projectType: "Academic Study",
    areaDetails: "MARINA TABASSUM",
    role: "Individual",
    dateRange: "09/2017",
    location: "Bangladesh",
    contribution: "Material Research\\Construction Drawing\\Conceptual Design",
    designStatementEN: "Under the guidance of Marina Tabassum, this pavilion academic study explores tectonic systems using native bamboo stalks in Bangladesh, delivering custom space filters and localized visual shade.",
    designStatementCN: "项目为Marina Tabassum设计教学课题下的空间竹构原型研究。深耕于孟加拉本土材料的自然建造，发挥毛竹的拉韧性与编织构造，形成精美而兼具防晒屏蔽性能的轻质共享遮亭。"
  },
  {
    id: "breaking-the-ice",
    title: "BREAKING THE ICE / 破冰",
    category: "Art",
    year: "2019",
    client: "Academic Study at GSD",
    description: "在Ewa Harabasz指导下进行的纸面铅笔手绘与炭笔速写艺术创作，通过细密的纹理构建深邃的单色张力。",
    fullDetails: "This drawing study, framed as graphite on paper and charcoal sketching under Ewa Harabasz, centers on surface texture boundaries, capturing physical resistance and high-contrast cracks under raw hand coordination.\n\n由Ewa Harabasz指导，纯粹纸上铅笔及炭笔手绘，通过极高密度的排线 and 粗破的炭块磨擦，呈现冰面开裂与冰川摩擦力之黑白张力，传达极致而寂静的自然物质情绪。",
    thumbnail: "https://i.postimg.cc/VkFk523F/14.jpg",
    gallery: [
      "https://i.postimg.cc/VkFk523F/14.jpg"
    ],
    tags: ["纸上速绘画", "炭材料挤压", "Ewa Harabasz", "哈佛GSD学术", "单色冰裂"],
    accentColor: "#3F3F46",
    
    subtitle: "Drawing / 绘画",
    projectType: "Drawing",
    areaDetails: "Ewa Harabasz",
    role: "Individual",
    dateRange: "02/2019 - 04/2019",
    location: "Cambridge, Massachusetts",
    contribution: "Traditional Drawing\\Composition\\Sketching",
    designStatementEN: "This drawing study, framed as graphite on paper and charcoal sketching under Ewa Harabasz, centers on surface texture boundaries, capturing physical resistance and high-contrast cracks under raw hand coordination.",
    designStatementCN: "由Ewa Harabasz指导，纯粹纸上铅笔及炭笔手绘，通过极高密度的排线和粗破的炭块磨擦，呈现冰面开裂与冰川摩擦力之黑白张力，传达极致而寂静的自然物质情绪。"
  },
  {
    id: "central-hall",
    title: "CENTRAL HALL / 中央大厅",
    category: "Art",
    year: "2019",
    client: "Academic Study at GSD",
    description: "在Ewa Harabasz指导下，运用纸面铅笔及炭笔，对大尺度空间结构、负空间体量以及光影消融进行的深度手绘描画。",
    fullDetails: "Completed as a spatial sketching study guided by Ewa Harabasz, this drawing uses paper-based graphite and deep charcoal lines to dissect negative room volumes, monumental architecture scale and shadow gradients.\n\n在Ewa Harabasz指导下创作。利用极有质感的特种纸、高墨色铅笔与炭笔，对古典式厅堂及巨构虚无负空间进行透视解剖与漫灭阴影复画，研究光感对混凝土及石材在视觉上的重力解构。",
    thumbnail: "https://i.postimg.cc/13K34bLc/13.jpg",
    gallery: [
      "https://i.postimg.cc/13K34bLc/13.jpg"
    ],
    tags: ["负量体解构", "透视阴影手绘", "巨物空间虚空", "纸面炭笔表现"],
    accentColor: "#18181B",
    
    subtitle: "Drawing / 绘画",
    projectType: "Drawing",
    areaDetails: "Ewa Harabasz",
    role: "Individual",
    dateRange: "02/2019 - 04/2019",
    location: "Cambridge, Massachusetts",
    contribution: "Traditional Drawing\\Visual Translation",
    designStatementEN: "Completed as a spatial sketching study guided by Ewa Harabasz, this drawing uses paper-based graphite and deep charcoal lines to dissect negative room volumes, monumental architecture scale and shadow gradients.",
    designStatementCN: "在Ewa Harabasz指导下创作。利用极有质感的特种纸、高墨色铅笔与炭笔，对古典式厅堂及巨构虚无负空间进行透视解剖与漫灭阴影复画，研究光感对混凝土及石材在视觉上的重力解构。"
  },

  // ==================== TECH ====================
  {
    id: "sound-map",
    title: "SOUND MAP / 声音地图",
    category: "Tech",
    year: "2019",
    client: "Academic Study at GSD",
    description: "项目位于哈佛大学GSD，在Krzysztof Wodiczko指导下与Xin Zheng合作，将空间音频流动映射并转译为多轴声音地图与物理声波地貌测绘系统。",
    fullDetails: "This project at Harvard GSD, in collaboration with Xin Zheng and guided by Krzysztof Wodiczko, explores the tactile materialization and mapping of environmental soundwaves. By converting spatial audios into responsive visual metrics and multi-axis topographies, we build interactive acoustic cartographies.\n\n项目为哈佛大学GSD学术设计课题，在Krzysztof Wodiczko指导下与Xin Zheng合作完成。设计探究声音在大气与建筑实体中的微弱震荡与传播边界，通过多轴物理测绘与可视化投影技术，将空间环境中的隐性音频流动转译为直观可触的声波地貌与声音地图。",
    thumbnail: "https://i.postimg.cc/SK56t6zd/sound-map.jpg",
    gallery: [
      "https://i.postimg.cc/SK56t6zd/sound-map.jpg"
    ],
    tags: ["声音地图", "空间声学测绘", "数据可视化", "GSD学术探索", "Bilibili音像记录"],
    accentColor: "#4F46E5",
    videoUrl: "https://www.bilibili.com/video/BV1ajEF6TEXE",
    
    subtitle: "Academic Study at GSD",
    projectType: "Academic Study",
    areaDetails: "Krzysztof Wodiczko",
    role: "Partner with Xin Zheng",
    dateRange: "05/2019",
    location: "Cambridge, Massachusetts",
    contribution: "Audio Cartography\\Interactive Projection\\Data Visualization",
    designStatementEN: "This project at Harvard GSD, in collaboration with Xin Zheng and guided by Krzysztof Wodiczko, explores the tactile materialization and mapping of environmental soundwaves. By converting spatial audios into responsive visual metrics and multi-axis topographies, we build interactive acoustic cartographies.",
    designStatementCN: "项目为哈佛大学GSD学术设计课题，在Krzysztof Wodiczko指导下与Xin Zheng合作完成。设计探究声音在大气与建筑实体中的微弱震荡与传播边界，通过多轴物理测绘与可视化投影技术，将空间环境中的隐性音频流动转译为直观可触的声波地貌与声音地图。"
  },
  {
    id: "cabinet-of-curiosities",
    title: "CABINET OF CURIOSITIES / 艺术馆抽屉与珍奇异宝网阁",
    category: "Tech",
    year: "2026",
    client: "Individual",
    description: "本网页设计作品以“艺术馆抽屉”为概念，将个人作品按照类别分门别类地陈列在虚拟展柜中。访客可以通过拉开不同的抽屉，探索每个分类下的作品，体验如同在真实艺术馆中逐一发现展品的趣味与惊喜。设计强调互动与探索感，同时保持整体空间的简洁与沉浸感。",
    fullDetails: "This web design project is based on the concept of “gallery drawers,” where personal works are organized and displayed in virtual exhibition cabinets by category. Visitors can open different drawers to explore each collection, creating an experience akin to discovering exhibits one by one in a real art gallery. The design emphasizes interactivity and exploration while maintaining a clean and immersive spatial environment.\n\n本网页设计作品以“艺术馆抽屉”为概念，将个人作品按照类别分门别类地陈列在虚拟展柜中。访客可以通过拉开不同的抽屉，探索每个分类下的作品，体验如同在真实艺术馆中逐一发现展品的趣味与惊喜。设计强调互动与探索感，同时保持整体空间的简洁与沉浸感。",
    thumbnail: "https://i.postimg.cc/6qTGf6Xt/Screen-Shot-2026-06-11-113414-986.jpg",
    gallery: [
      "https://i.postimg.cc/6qTGf6Xt/Screen-Shot-2026-06-11-113414-986.jpg",
      "https://i.postimg.cc/T1hWJ26T/Screen-Shot-2026-06-11-143342-834.jpg",
      "https://i.postimg.cc/brd29Yj7/Screen-Shot-2026-06-11-143356-641.jpg",
      "https://i.postimg.cc/L5hZ34pH/Screen-Shot-2026-06-11-143407-099.jpg",
      "https://i.postimg.cc/brd29Yhw/Screen-Shot-2026-06-11-143420-361.jpg",
      "https://i.postimg.cc/Vv5bWs8b/Screen-Shot-2026-06-11-143439-682.jpg"
    ],
    tags: ["Web Design", "Vibe Coding", "艺术馆抽屉", "交互设计", "虚拟展柜"],
    accentColor: "#0f766e",
    videoUrl: "https://www.bilibili.com/video/BV1aiEY6aEtj/?spm_id_from=333.1387.homepage.video_card.click",
    
    subtitle: "Web Design/Vibe Coding",
    projectType: "Web Design / Vibe Coding",
    areaDetails: "Individual / Shanghai",
    role: "Creator",
    dateRange: "06/2026",
    location: "Shanghai",
    contribution: "Concept Design, Interactive & Frontend Web Development",
    designStatementEN: "This web design project is based on the concept of “gallery drawers,” where personal works are organized and displayed in virtual exhibition cabinets by category. Visitors can open different drawers to explore each collection, creating an experience akin to discovering exhibits one by one in a real art gallery. The design emphasizes interactivity and exploration while maintaining a clean and immersive spatial environment.",
    designStatementCN: "本网页设计作品以“艺术馆抽屉”为概念，将个人作品按照类别分门别类地陈列在虚拟展柜中。访客可以通过拉开不同的抽屉，探索每个分类下的作品，体验如同在真实艺术馆中逐一发现展品的趣味与惊喜。设计强调互动与探索感，同时保持整体空间的简洁与沉浸感。"
  },

  // ==================== NOTES ====================
  {
    id: "jingyi-bi-bio",
    title: "BIOGRAPHY & C.V. / Penny Bi 个人介绍与履历",
    category: "Notes",
    year: "Active",
    client: "Biographic Dossier / 个人简历",
    description: "Penny Bi 是一位具有建筑学背景的跨媒介创作者、设计师与教育者。毕业于哈佛大学设计学院，实践横跨建筑、空间、影像与数字媒介，关注身体、感知与技术如何共同塑造空间体验。",
    fullDetails: "Biographic dossier of Penny Bi.",
    thumbnail: "https://i.postimg.cc/y8Dm0Nph/wei-xin-tu-pian-2026061163045-196-71.jpg",
    gallery: [
      "https://i.postimg.cc/y8Dm0Nph/wei-xin-tu-pian-2026061163045-196-71.jpg"
    ],
    tags: ["教育与学者", "跨媒介创作", "哈佛设计学院", "计算式语法设计", "如恩与OMA"],
    accentColor: "#1E1B4B",
    
    subtitle: "PORTFOLIO DOSSIER & CURRICULUM VITAE",
    projectType: "Professional Biography & CV",
    areaDetails: "Harvard University GSD & Massachusetts Institute of Technology",
    role: "Independent Creator, Designer & Educator",
    dateRange: "2018 - 2026",
    location: "Shanghai & Cambridge, MA",
    contribution: "Bilingual Experience, Skillsets and Contact Details",
    designStatementEN: "An arch-trained cross-disciplinary creator, designer, and educator. Graduated from Harvard Graduate School of Design, her practice traverses architecture, space, moving images, and digital media, focusing on how bodily spatial experience is crafted.",
    designStatementCN: "Penny Bi。具有建筑背景的跨媒介创作者、设计师与教育者。毕业于哈佛大学设计学院，专注于探究人体感知与空间媒介互置的张力边界，以此微型旋转档案架作为研究原型的数字化复刻。"
  },
  {
    id: "snowy-night-light",
    title: "SILENT LIGHT IN SNOWY NIGHT / 雪夜里的静光",
    category: "Art",
    year: "2025",
    client: "Private Collection // 个人架上绘画",
    description: "画面以温柔的色彩描绘一座雪夜中的城市：粉紫色的天空下，弯月高悬，雪花静静飘落。",
    fullDetails: "画面以温柔的色彩描绘一座雪夜中的城市：粉紫色的天空下，弯月高悬，雪花静静飘落。城市灯光在远处闪烁，前景的松树被白雪覆盖，像守夜的观察者。整幅画充满童话般的宁静与安全感，仿佛在喧闹世界之外，为观者保留了一处安静、柔软的心灵栖息地。\n\nThis painting portrays a city wrapped in a gentle snowy night. Beneath a pink-violet sky, a crescent moon glows as snow drifts quietly through the air. Distant city lights shimmer softly, while snow-covered pine trees stand in the foreground like silent guardians. The scene feels calm and storybook-like, offering a sense of warmth, protection, and quiet retreat from the outside world.",
    thumbnail: "https://i.postimg.cc/0jvnfqMn/wei-xin-tu-pian-20260601163044-195-71.jpg",
    gallery: [
      "https://i.postimg.cc/0jvnfqMn/wei-xin-tu-pian-20260601163044-195-71.jpg"
    ],
    tags: ["绘画", "油画帆布", "纺织涂料", "雪景治愈", "色彩静物"],
    accentColor: "#2E3B5E",
    subtitle: "CANVAS PAINTING / 帆布色彩小品",
    projectType: "Painting / 绘画",
    areaDetails: "Canvas / 帆布 / 纺织涂料 (14cm × 13cm)",
    role: "Painter / 创作者",
    dateRange: "06/2025",
    location: "Xiamen, Fujian / 福建厦门",
    contribution: "Concept, Sketching, and Pigment Application / 构思与色彩绘制",
    designStatementEN: "This painting portrays a city wrapped in a gentle snowy night. Beneath a pink-violet sky, a crescent moon glows as snow drifts quietly through the air. Distant city lights shimmer softly, while snow-covered pine trees stand in the foreground like silent guardians. The scene feels calm and storybook-like, offering a sense of warmth, protection, and quiet retreat from the outside world.",
    designStatementCN: "画面以温柔的色彩描绘一座雪夜中的城市：粉紫色的天空下，弯月高悬，雪花静静飘落。城市灯光在远处闪烁，前景的松树被白雪覆盖，整个画面充满童话般的宁静与安全感，是喧嚣中一处安静柔软的心灵栖息地。"
  },
  {
    id: "summer-lotus-reflection",
    title: "SUMMER POND REFLEXIONS / 夏池莲影",
    category: "Art",
    year: "2025",
    client: "Private Collection // 个人架上绘画",
    description: "这幅小幅油画致敬莫奈经典的睡莲主题。以朦胧的蓝紫调铺展水面，用写意的笔触晕染出莲叶与倒影。",
    fullDetails: "这幅小幅油画致敬莫奈经典的睡莲主题。以朦胧的蓝紫调铺展水面，用写意的笔触晕染出莲叶与倒影，弱化轮廓、强化光影与色彩的交融，将夏日池畔的静谧与柔化的光影定格在方寸之间，传递出慵懒、治愈的氛围。\n\nThis small oil painting pays homage to Monet's iconic water lily series. It unfolds the water surface with soft blue and purple tones, rendering lily pads and reflections with loose, impressionistic brushstrokes. Blurring clear outlines to highlight the interplay of light and color, it captures the quiet serenity of a summer pond in miniature, evoking a gentle, calming mood.",
    thumbnail: "https://i.postimg.cc/y8Dm0Nph/wei-xin-tu-pian-2026061163045-196-71.jpg",
    gallery: [
      "https://i.postimg.cc/y8Dm0Nph/wei-xin-tu-pian-2026061163045-196-71.jpg"
    ],
    tags: ["绘画", "帆布 / 纺织涂料", "印象睡莲", "色彩交融", "水面微澜"],
    accentColor: "#3B3C6E",
    subtitle: "CANVAS PAINTING / 帆布色彩小品",
    projectType: "Painting / 绘画",
    areaDetails: "Canvas / 帆布 / 纺织涂料 (14cm × 13cm)",
    role: "Painter / 创作者",
    dateRange: "06/2025",
    location: "Xiamen, Fujian / 福建厦门",
    contribution: "Concept, Color Balancing, and Ink Rendering / 印象构思与意会晕染",
    designStatementEN: "This small oil painting pays homage to Monet's iconic water lily series. It unfolds the water surface with soft blue and purple tones, rendering lily pads and reflections with loose, impressionistic brushstrokes. Blurring clear outlines to highlight the interplay of light and color, it captures the quiet serenity of a summer pond in miniature, evoking a gentle, calming mood.",
    designStatementCN: "致敬莫奈经典的睡莲主题，以朦胧的蓝紫调铺展水面，用写意的笔触晕染出莲叶与倒影。弱化外部实体轮廓、全力塑造微弱光影与色块的重叠交融，使慵懒、治愈的夏日池畔定格于方寸画纸之中。"
  }
];
