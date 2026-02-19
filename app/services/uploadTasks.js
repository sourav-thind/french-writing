const admin = require('firebase-admin');

// Download service account key from Firebase Console:
// Project Settings > Service Accounts > Generate New Private Key
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();


const tache1Tasks = [
  {
    type: 'tache1',
    title: 'Réunion d\'anciens élèves',
    scenario: 'Après des années passées à l\'école à entendre les moqueries des autres élèves, un homme de 30 ans a gagné l\'admiration de tout le monde lors d\'une réunion d\'anciens élèves. Racontez les faits.',
    answer: 'Les faits se sont déroulés samedi dernier vers 9h30. Un homme âgé de 31 ans a été ovationné lors d\'une réunion d\'anciens élèves organisée dans la salle municipale de la rue Phillips. En effet, il a surpris tout le monde en prenant la parole pour raconter son parcours depuis le lycée marqué par des années de moqueries et d\'exclusion. À la surprise des anciens camarades, il a montré une vidéo de l\'association qu\'il dirige aujourd\'hui pour soutenir les jeunes victimes de harcèlement.',
  },
  {
    type: 'tache1',
    title: 'L\'homme coincé dans la vitrine',
    scenario: 'Les habitants d\'une petite ville ont été réveillés par les appels à l\'aide d\'un homme coincé dans la vitrine étroite d\'une boutique de bijoux. Racontez les faits.',
    answer: 'Les faits se sont déroulés samedi dernier vers 19h00. Marc, âgé de 34 ans, a été retrouvé coincé dans la vitrine d\'une bijouterie située sur la rue Phillips. En effet, les habitants ont entendu ses appels alors qu\'il tentait désespérément de sortir de l\'espace étroit. Le trentenaire, visiblement paniqué, avait tenté de s\'introduire discrètement pour un vol mais son sac s\'était coincé et l\'avait immobilisé. Les passants d\'abord incrédules ont appelé la police.',
  },
  {
    type: 'tache1',
    title: 'Performance artistique insolite',
    scenario: 'Un artiste a été photographié allongé par terre dans des lieux touristiques à travers le monde. Cette fois-ci, les autorités municipales ont dû intervenir. Racontez les faits.',
    answer: 'Les faits se sont déroulés samedi dernier vers 10h. Un artiste a été aperçu allongé devant le monument historique de la rue Phillips. Les passants ont été surpris de voir un homme immobile au sol. En effet, l\'homme faisait partie d\'un projet artistique dont le but est de questionner le rapport à l\'espace public. Cependant, la police municipale a mis fin à la performance car il n\'y avait aucune autorisation officielle.',
  },
  {
    type: 'tache1',
    title: 'Le ticket de loterie effacé',
    scenario: 'Un couple s\'est présenté avec un ticket de loterie gagnant 3 millions de dollars, mais au moment de la vérification, il y a eu un petit problème... Racontez les faits.',
    answer: 'Un couple, Jeanne et Marc, s\'est présenté au comptoir de la loterie situé sur la rue Phillips avec un ticket gagnant de 3 millions de dollars. À la surprise des employés, le ticket semblait usé et partiellement effacé. Le couple expliquait que le billet avait été laissé sur la table de la cuisine et que de l\'eau l\'avait endommagé. L\'équipe technique a tenté de scanner le code-barres mais la vérification reste complexe.',
  },
  {
    type: 'tache1',
    title: 'L\'enfant qui appelle la police',
    scenario: 'Déçu par les cadeaux de Noël, un enfant de 6 ans a appelé la police. Racontez les faits.',
    answer: 'Les faits se sont déroulés samedi dernier vers 9h30. Un enfant de 6 ans a composé le 911 depuis la maison familiale. En effet, l\'enfant était mécontent de ses cadeaux de Noël et a déclaré aux agents qu\'il souhaitait porter plainte contre le Père Noël. Il expliquait qu\'il avait demandé un robot mais qu\'il n\'avait reçu que des vêtements. Les agents ont dû éduquer l\'enfant sur l\'usage responsable du téléphone d\'urgence.',
  },
  {
    type: 'tache1',
    title: 'Le pirate informatique belge',
    scenario: 'Un Belge de 25 ans a piraté le système de réservation en ligne d\'une compagnie aérienne pour s\'offrir un voyage. Racontez les faits.',
    answer: 'Thomas, âgé de 25 ans, a été interpellé à l\'aéroport après avoir piraté le système de la compagnie AirBelgium. Il avait réussi à contourner la sécurité pour s\'offrir un aller-retour gratuit à New York pour lui et une amie. À son retour, les agents de sécurité l\'attendaient car ses actions avaient été découvertes par un logiciel de surveillance. Il est maintenant poursuivi pour cybercriminalité.',
  },
  {
    type: 'tache1',
    title: 'L\'intrus du magasin de sport',
    scenario: 'Un homme de 31 ans a été découvert dans un magasin de sport après avoir pénétré par le toit durant la nuit. Racontez les faits.',
    answer: 'Julien, âgé de 31 ans, a été découvert dans un magasin de sport de la rue Phillips. Il était entré par le toit durant la nuit en escaladant le bâtiment. À l\'arrivée des policiers, l\'homme n\'était pas en train de fuir mais lisait tranquillement les brochures des articles de randonnée. Il a affirmé qu\'il ne voulait pas voler mais simplement explorer les produits. Il est poursuivi pour violation de domicile.',
  },
  {
    type: 'tache1',
    title: 'L\'atelier de l\'artiste exotique',
    scenario: 'Un célèbre artiste peintre a dû appeler les secours suite à un accident. Les pompiers ont été accueillis par des animaux domestiques peu ordinaires. Racontez les faits.',
    answer: 'Claude, un artiste de 72 ans, a appelé les secours après être tombé d\'une échelle dans son atelier. À l\'arrivée des pompiers, ces derniers ont été accueillis par des animaux exotiques : des perroquets, des serpents et un iguane. Un des perroquets, perturbé par l\'agitation, a imité les sirènes des secours, ce qui a compliqué l\'intervention. L\'artiste souffre d\'une cheville tordue.',
  },
  {
    type: 'tache1',
    title: 'La bouteille du fleuve Congo',
    scenario: 'Sur les rives du fleuve Congo, deux filles ont découvert une bouteille contenant un message mystérieux. Racontez les faits.',
    answer: 'Amina et Mariam, âgées de 10 et 12 ans, se promenaient sur les rives du fleuve Congo lorsqu\'elles ont trouvé une bouteille flottante. À l\'intérieur se trouvait un message écrit à la main et une carte. Le texte racontait l\'histoire d\'un naufrage et d\'un trésor perdu. Les autorités locales ont été contactées, mais suspectent pour l\'instant une farce ou un jeu en cours dans la région.',
  },
  {
    type: 'tache1',
    title: 'Le jeune héros du bus scolaire',
    scenario: 'Walid, âgé de 13 ans, a sauvé ses camarades d\'un accident en remplaçant soudainement le chauffeur du bus. Racontez les faits.',
    answer: 'Vendredi dernier, Walid a sauvé ses camarades en prenant le contrôle du bus scolaire après que le chauffeur a perdu connaissance. Alors que le véhicule circulait sur la rue Phillips, le conducteur s\'est effondré. Walid, assis près de lui, a réagi immédiatement en saisissant le volant. Avec beaucoup de sang-froid, il a réussi à ralentir et arrêter le véhicule en toute sécurité, évitant ainsi une tragédie.',
  },
  {
    type: 'tache1',
    title: 'La maison aux secrets',
    scenario: 'Un jeune homme roulant très vite a perdu le contrôle de son véhicule et a percuté une vieille maison. Le mur s\'est effondré, et là, quelle surprise ! Racontez les faits.',
    answer: 'Un jeune homme de 22 ans a percuté le mur d\'une vieille maison sur la rue Phillips[cite: 98, 99]. Sous l\'impact, le mur s\'est effondré pour révéler une pièce secrète[cite: 100, 102]. Les secours y ont découvert un vieux coffre en bois contenant des documents et objets datant du 19e siècle [cite: 103-105]. Cette découverte archéologique pourrait être d\'une grande importance pour la région[cite: 113].'
  },
  {
    type: 'tache1',
    title: 'Le sauveur de la rivière',
    scenario: 'Un enfant de 4 ans, en jouant près de la rivière, est tombé à l\'eau. Heureusement, son sauveur est arrivé à temps. Racontez les faits.',
    answer: 'Un enfant de 4 ans jouait près de la rue Phillips lorsqu\'il a glissé et est tombé dans l\'eau, emporté par le courant [cite: 117-119]. Un jeune homme passant par là a immédiatement sauté dans l\'eau glacée pour l\'attraper[cite: 120, 121]. En quelques secondes, il a ramené l\'enfant sur la rive[cite: 123]. Bien que trempé, l\'enfant est sain et sauf[cite: 124].'
  },
  {
    type: 'tache1',
    title: 'Le motard au ballon',
    scenario: 'Un motard a été arrêté à 210 km/h sur l\'autoroute. Il conduisait avec un seul bras, l\'autre portant un objet surprenant. Racontez les faits.',
    answer: 'Un motard de 20 ans a été intercepté à 210 km/h sur l\'autoroute[cite: 136, 137]. À la surprise des agents, il conduisait d\'un seul bras car il tenait un gros ballon de baudruche gonflé à l\'hélium[cite: 140, 141]. Le jeune homme utilisait sa vitesse pour maintenir le ballon en l\'air[cite: 142]. Il a été arrêté pour conduite dangereuse[cite: 144].'
  },
  {
    type: 'tache1',
    title: 'Le critique d\'art maladroit',
    scenario: 'Lors d\'une grande exposition d\'art contemporain, un visiteur, critique d\'art, a fait tomber une création en verre estimée à 20 000 dollars. Racontez les faits.',
    answer: 'Dans un musée de la rue Phillips, un critique d\'art de 45 ans a accidentellement heurté le socle d\'une sculpture en verre [cite: 155-158]. La création, estimée à 20 000 dollars, s\'est brisée en plusieurs morceaux[cite: 157, 161]. Le critique s\'est empressé de s\'excuser, expliquant qu\'il voulait simplement observer l\'œuvre de plus près[cite: 162, 163].'
  },
  {
    type: 'tache1',
    title: 'Le t-shirt du sans-abri',
    scenario: 'L\'inscription sur le t-shirt d\'un sans-abri à la sortie d\'un supermarché a retenu l\'attention d\'un policier. Il a décidé d\'agir. Racontez les faits.',
    answer: 'Un homme de 45 ans portait un t-shirt avec l\'inscription "inutile et sans avenir"[cite: 177, 178]. Un policier, touché par ce message dévalorisant, a engagé la conversation et découvert que l\'homme était un ancien ingénieur informatique [cite: 179-182]. Le policier l\'a accompagné vers un centre d\'accueil pour lui fournir des ressources et un soutien immédiat[cite: 184, 185].'
  },
  {
    type: 'tache1',
    title: 'Le coffre du labrador',
    scenario: 'Samedi dernier, Mehdi, septuagénaire, promenait son chien près du lac quand celui-ci a fait une découverte bien étrange. Racontez les faits.',
    answer: 'Mehdi promenait son labrador, Max, près du lac de la rue Phillips quand le chien a déterré un coffre en métal sous les feuilles [cite: 198-201]. À l\'intérieur, Mehdi a trouvé des pièces de monnaie, des bijoux et des documents datant du début du 20e siècle[cite: 203, 204]. La police et des archéologues ont été contactés pour étudier cet artefact historique[cite: 205, 213].'
  },
  {
    type: 'tache1',
    title: 'La fugue de Romain',
    scenario: 'Jeudi dernier, Romain, 2 ans, a discrètement échappé du jardin d\'enfants où il passait la journée. Racontez les faits.',
    answer: 'Pendant que les éducatrices étaient occupées, Romain, 2 ans, a réussi à ouvrir la porte du jardin d\'enfants et à s\'échapper sans être vu [cite: 217-221]. Les parents et la police ont été immédiatement alertés pour commencer les recherches[cite: 216].'
  },
  {
    type: 'tache1',
    title: 'Les perroquets malpolis',
    scenario: 'En août dernier, un zoo britannique a adopté cinq perroquets. 20 minutes après avoir été présentés au public, ils ont commencé à insulter les visiteurs. Racontez les faits.',
    answer: 'Un zoo britannique a accueilli cinq perroquets, mais 20 minutes après leur présentation, les oiseaux ont commencé à insulter le public [cite: 322-325]. L\'enquête a révélé qu\'ils avaient été élevés dans un environnement où ils étaient exposés à des propos inappropriés[cite: 326]. Le zoo a dû isoler les oiseaux pour commencer leur rééducation[cite: 327].'
  },
  {
    type: 'tache1',
    title: 'La grand-mère virale',
    scenario: 'N. Furtado filme sa grand-mère en train de chanter dans la cuisine. Quelques jours plus tard, la vidéo devient virale. Racontez les faits.',
    answer: 'Une jeune fille a filmé sa grand-mère chantant joyeusement dans sa cuisine et a partagé la vidéo sur les réseaux sociaux [cite: 332-334]. Quelques jours plus tard, la vidéo est devenue virale, accumulant des milliers de vues et attirant même l\'attention de producteurs de musique[cite: 335, 338].'
  },
  {
    type: 'tache1',
    title: 'L\'étudiant sans batterie',
    scenario: 'Un étudiant français arrive à Auckland pour un stage. Son téléphone n\'a plus de batterie et son séjour prend une tournure inattendue. Racontez les faits.',
    answer: 'Arrivé à Auckland, un étudiant s\'est retrouvé sans batterie, ne pouvant plus utiliser son GPS ni contacter son employeur [cite: 340-343]. En attendant de recharger son téléphone, il a pris un bus touristique et a découvert des sites qu\'il n\'aurait jamais visités autrement[cite: 344, 345].'
  },
  {
    type: 'tache1',
    title: 'Le livreur de Noël',
    scenario: 'Un homme de 50 ans trouve un autre homme sous un arbre avec un sac rempli de cadeaux et une liste de noms. Racontez les faits.',
    answer: 'Le 24 décembre, un homme a découvert un inconnu allongé sous un arbre avec un sac de cadeaux et une liste de noms [cite: 349-352]. Inquiet, il a alerté les autorités, qui ont découvert qu\'il s\'agissait simplement d\'un acteur pour une campagne en faveur des enfants défavorisés[cite: 353, 355].'
  },
  {
    type: 'tache1',
    title: 'L\'hommage tardif',
    scenario: 'Au gala Dynastie, le ministre de la Culture a présenté ses condoléances pour le décès de Jean-Louis Phillips. Racontez les faits.',
    answer: 'Le ministre a rendu hommage à l\'écrivain Jean-Louis Phillips, décédé dans l\'anonymat sans jamais avoir reçu de récompense de son vivant[cite: 357, 358]. Ce geste a été jugé insuffisant par les proches de l\'auteur, qui dénonçaient depuis longtemps une injustice institutionnelle à son égard[cite: 359, 360].'
  },
  {
    type: 'tache1',
    title: 'Le secret de Mamie Elise',
    scenario: 'Bossil reçoit une lettre datant de 1990 écrite par sa grand-mère. Le contenu va changer sa vie. Racontez les faits.',
    answer: 'Bossil a trouvé une lettre de 1990 écrite par sa grand-mère disparue[cite: 363, 364]. Le courrier révélait que son père biologique n\'était pas celui qu\'il croyait, mais un amour de jeunesse caché par la famille pour éviter le scandale[cite: 365]. Bossil envisage maintenant un test ADN pour retrouver cet homme[cite: 366].'
  },
  {
    type: 'tache1',
    title: 'Le plus vieux couple du monde',
    scenario: 'Jeanne (105 ans) et Marcel (106 ans) sont le plus vieux couple marié au monde. Ils avaient un secret bien gardé. Racontez les faits.',
    answer: 'Mariés depuis 82 ans, Jeanne et Marcel sont entrés dans le livre des records [cite: 369-371]. Ils ont révélé qu\'ils s\'étaient enfuis ensemble à l\'âge de 23 ans pour se marier en secret contre la volonté de leurs familles[cite: 372]. Ce secret a forgé leur longévité conjugale[cite: 373].'
  },
  {
    type: 'tache1',
    title: 'L\'enfant et les panthères',
    scenario: 'Une petite fille de 4 ans s\'est retrouvée dans l\'enclos des panthères au zoo. Racontez les faits.',
    answer: 'Une fillette a échappé à la vigilance de ses parents et est tombée dans l\'enclos des panthères[cite: 378]. À la stupeur générale, les félins ne se sont pas montrés agressifs[cite: 380]. L\'un d\'eux s\'est approché calmement de l\'enfant jusqu\'à ce que les soigneurs puissent l\'extraire sans blessure[cite: 381].'
  },
  {
    type: 'tache1',
    title: 'La chèvre saboteuse',
    scenario: 'Un village de 200 personnes a été privé d\'Internet. La police a découvert une coupable surprenante. Racontez les faits.',
    answer: 'Après trois jours sans Internet, la police a découvert que la panne était causée par une chèvre locale [cite: 385-392]. L\'animal, échappé de son enclos, avait mangé un câble principal de fibre optique[cite: 393]. Le service a été rétabli après des réparations urgentes[cite: 396].'
  },
  {
    type: 'tache1',
    title: 'L\'hôtel fantôme',
    scenario: 'Une famille arrive en vacances mais s\'aperçoit que l\'hôtel réservé n\'existe pas. Leur réaction a intéressé les médias. Racontez les faits.',
    answer: 'Une famille de Lyon est arrivée à Plukart pour découvrir que leur hôtel n\'était qu\'un terrain vague, victime d\'une arnaque en ligne [cite: 404-407]. Au lieu de se mettre en colère, ils ont installé une tente sur la place centrale, attirant la sympathie des habitants qui leur ont offert le gîte [cite: 408-414].'
  },
  {
    type: 'tache1',
    title: 'La spirale de cheveux',
    scenario: 'Surprise par la coiffure de son enfant, une maman découvre un secret sur sa famille. Racontez les faits.',
    answer: 'Camille a remarqué une spirale de cheveux unique chez son fils[cite: 420, 421]. En comparant avec de vieilles photos, elle a découvert que son arrière-grand-père, dont l\'histoire avait été effacée par préjugé, avait la même caractéristique [cite: 424-429]. Cela lui a permis de reconstituer son héritage oublié[cite: 430, 431].'
  },
  {
    type: 'tache1',
    title: 'La vengeance de Maria',
    scenario: 'Après avoir découvert que son mari menait une double vie, Maria a trouvé une manière originale de se venger. Racontez les faits.',
    answer: 'Maria a découvert la trahison de son mari sur une tablette partagée[cite: 437, 438]. Elle a organisé une fausse fête d\'anniversaire et a projeté les preuves de son infidélité sur écran géant devant tous les invités [cite: 441-444]. Le mari a quitté les lieux sans un mot[cite: 446, 447].'
  },
  {
    type: 'tache1',
    title: 'L\'examen anti-triche',
    scenario: 'Le directeur d\'une université a eu une idée originale pour que les étudiants ne copient pas. Racontez les faits.',
    answer: 'Pour lutter contre la triche, un directeur d\'université à Bordeaux a créé plus de 200 versions différentes d\'un même examen [cite: 452-454, 459]. Chaque étudiant recevait un sujet unique avec des données et des chiffres légèrement modifiés, rendant la copie sur le voisin impossible [cite: 455-457].'
  },
  {
    type: 'tache1',
    title: 'Nuit blanche au palace',
    scenario: 'Un couple de touristes n\'a pas pu dormir dans son hôtel de luxe malgré le prix élevé. Racontez les faits.',
    answer: 'Un couple japonais a payé une fortune pour une suite à Paris, mais n\'a pas fermé l\'œil à cause du bruit incessant des cloches d\'une église et de travaux nocturnes [cite: 469-475]. L\'hôtel a refusé de les rembourser, affirmant ne pas être responsable des nuisances extérieures[cite: 477, 478].'
  },
  {
    type: 'tache1',
    title: 'La loterie expirée',
    scenario: 'Les gagnants d\'une loterie se sont manifestés trop tard, mais l\'organisme a proposé un échange. Racontez les faits.',
    answer: 'Un couple a découvert son gain de 3 000 euros après la date limite [cite: 486-488]. L\'organisme a refusé de payer mais a proposé d\'échanger le ticket contre une place pour un tirage spécial avec un jackpot plus élevé [cite: 489-491]. Le couple a accepté cette seconde chance[cite: 496].'
  },
  {
    type: 'tache1',
    title: 'Le banquet nocturne',
    scenario: 'Un groupe d\'amis est entré dans un restaurant fermé pour terminer leur soirée. Racontez les faits.',
    answer: 'À une heure du matin, des amis sont entrés dans un restaurant par une porte restée entrouverte [cite: 500-504]. La police les a surpris en train de déguster les restes de la cuisine et quelques bouteilles [cite: 505-507]. Le propriétaire n\'a pas porté plainte car aucun dommage n\'a été constaté[cite: 509].'
  }


] 
const tache2Tasks = [
  { type: 'tache2', title: "Il faut habiter seul pour devenir un adulte responsable." },
  { type: 'tache2', title: "Dans 50 ans, on ne lira plus de livres et plus personne n'écrira correctement." },
  { type: 'tache2', title: "Il faut interdire les sorties nocturnes pour les mineurs non accompagnés." },
  { type: 'tache2', title: "La vie est très courte ; il est impossible de réaliser tous nos rêves." },
  { type: 'tache2', title: "Avec la pollution générale, faire attention à sa santé semble de moins en moins utile." },
  { type: 'tache2', title: "Pour être en bonne santé, il n'est pas nécessaire d'être végétarien." },
  { type: 'tache2', title: "Toutes les personnes âgées devraient être équipées d'un smartphone." },
  { type: 'tache2', title: "Les cantines des écoles devraient proposer uniquement des repas végétariens." },
  { type: 'tache2', title: "Les enfants ne font plus rien avec leurs mains." },
  { type: 'tache2', title: "Les réseaux sociaux détruisent les relations humaines." },
  { type: 'tache2', title: "Stop aux langues étrangères ; apprenons correctement notre langue maternelle." },
  { type: 'tache2', title: "L'apprentissage d'un instrument de musique devrait être obligatoire." },
  { type: 'tache2', title: "La discipline s'apprend à la maison, pas à l'école." },
  { type: 'tache2', title: "Le tabac tue ; il faut l'interdire définitivement." },
  { type: 'tache2', title: "Le télétravail devrait être obligatoire pour les employés." },
  { type: 'tache2', title: "Enseigner le dessin ou la musique à l'école est une perte de temps." },
  { type: 'tache2', title: "Aujourd'hui, acheter des vêtements neufs est un geste irresponsable." },
  { type: 'tache2', title: "Plus besoin de médicaments ; les plantes sont tout aussi efficaces." },
  { type: 'tache2', title: "Le mariage a beaucoup moins de valeur qu'avant." },
  { type: 'tache2', title: "Dans le monde actuel, on ne peut être heureux sans travailler." },
  { type: 'tache2', title: "Il est normal que les postes importants soient réservés aux personnes de plus de 50 ans." },
  { type: 'tache2', title: "Dans 20 ans, il n'y aura plus de livres." },
  { type: 'tache2', title: "Pour être heureux, il faut s'entourer de personnes qui nous ressemblent." },
  { type: 'tache2', title: "Il est aujourd'hui devenu impossible de vivre sans internet." },
  { type: 'tache2', title: "Pour prévenir les crimes, il faudrait organiser une surveillance vidéo, y compris à domicile." },
  { type: 'tache2', title: "Dans cette société des écrans et de l'usage, les jeunes ne sauront bientôt plus lire." },
  { type: 'tache2', title: "Tant que les avions seront polluants, il faudra les interdire." },
  { type: 'tache2', title: "Les ados ne respectent rien, il faut renforcer la discipline à l'école." },
  { type: 'tache2', title: "L'écriture manuscrite disparaît ; bientôt, nos enfants ne sauront plus se servir d'un stylo." },
  { type: 'tache2', title: "Aujourd'hui, dans le sport, l'argent est le seul maître." },
  { type: 'tache2', title: "Vu la quantité de films et de séries TV, ce n'est plus la peine de lire des livres." },
  { type: 'tache2', title: "L'expérience de la vie et des voyages vaut plus que tous les diplômes." },
  { type: 'tache2', title: "20 ans, c'est l'âge où l'on est le plus heureux." },
  { type: 'tache2', title: "Il faudrait limiter l'usage des réseaux sociaux à une heure par jour." },
  { type: 'tache2', title: "Les jeunes devraient pouvoir voter avant leur majorité." },
  { type: 'tache2', title: "Notre mode de vie est trop influencé par les célébrités et la publicité." },
  { type: 'tache2', title: "Il est plus facile de se faire des amis en ligne que dans la vie réelle." },
  { type: 'tache2', title: "Les œuvres d'art devraient retourner dans les pays d'origine." },
  { type: 'tache2', title: "Avec Internet et les réseaux sociaux, nous sommes devenus des marchandises." },
  { type: 'tache2', title: "De nos jours, il n'est pas nécessaire d'avoir du talent pour être une star." },
  { type: 'tache2', title: "En raison des crises à l'échelle mondiale, nous allons devoir apprendre à cultiver notre propre nourriture." },
  { type: 'tache2', title: "Pour être en bonne santé, il n'est pas nécessaire d'être végétarien." },
  { type: 'tache2', title: "Le travail est devenu la principale source des problèmes de santé." },
  { type: 'tache2', title: "Si on n'est pas propriétaire d'un logement à 40 ans, on a raté sa vie." },
  { type: 'tache2', title: "Les zoos maltraitent les animaux, il faudrait les interdire." },
  { type: 'tache2', title: "Sur internet, on ne peut pas se faire de vrais amis." },
  { type: 'tache2', title: "Pour mieux intéresser les élèves, les professeurs devraient utiliser les smartphones en classe." },
  { type: 'tache2', title: "Les restaurants devraient privilégier les menus sans contact." },
  { type: 'tache2', title: "Les voyages de moins de 15 jours devraient être interdits afin de limiter la pollution." },
  { type: 'tache2', title: "Chaque citoyen devrait aider son voisin une fois par semaine pour préserver les relations humaines." },
  { type: 'tache2', title: "Pour sauver la planète, il faut prendre des douches plutôt que des bains." },
  { type: 'tache2', title: "Certains mensonges sont parfois acceptables, tout dépend du contexte." },
  { type: 'tache2', title: "Addiction aux réseaux sociaux : les adultes aussi." },
  { type: 'tache2', title: "Un adolescent devrait pouvoir utiliser son argent de poche comme il veut." },
  { type: 'tache2', title: "Le télétravail ? Une solution pour les riches ?" },
  { type: 'tache2', title: "L'école doit donner la possibilité aux élèves d'évaluer leurs enseignants." },
  { type: 'tache2', title: "Le système scolaire est trop compétitif ; il faudrait supprimer les notes." },
  { type: 'tache2', title: "Toutes les entreprises doivent financer les actions écologiques." },
  { type: 'tache2', title: "Il est indispensable de valoriser l'enseignement du français écrit auprès des jeunes." },
  { type: 'tache2', title: "Pour favoriser l'instruction, les livres devraient être gratuits." },
  { type: 'tache2', title: "De nos jours, les gens ne savent plus manger sainement." },
  { type: 'tache2', title: "Les gouvernements doivent prendre des mesures plus efficaces pour lutter contre la pollution." },
  { type: 'tache2', title: "Les enfants passent beaucoup trop de temps à l'école." },
  { type: 'tache2', title: "Il faudrait interdire aux enfants de venir sans être accompagnés." }
];

async function upload() {
  const batch = db.batch();

  // Add Tâche 1
  tache1Tasks.forEach((task, index) => {
    const ref = db.collection('tefTasks').doc(`tache1_${index + 1}`);
    batch.set(ref, { ...task, createdAt: new Date() });
  });

  // Add Tâche 2
  tache2Tasks.forEach((task, index) => {
    const ref = db.collection('tefTasks').doc(`tache2_${index + 1}`);
    batch.set(ref, { ...task, createdAt: new Date() });
  });

  await batch.commit();
  console.log("Success! All tasks are now in Firestore.");
}

upload().catch(console.error);