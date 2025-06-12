document.addEventListener('DOMContentLoaded', function() {
    // --- Lógica do Contador ---
    const startDate = new Date('March 12, 2022 19:35:00'); // **ATUALIZE ESTA DATA PARA A SUA DATA DE INÍCIO DO RELACIONAMENTO**
    const yearsSpan = document.getElementById('years');
    const monthsSpan = document.getElementById('months');
    const daysSpan = document.getElementById('days');
    const hoursSpan = document.getElementById('hours');
    const minutesSpan = document.getElementById('minutes');
    const secondsSpan = document.getElementById('seconds');

    const alternatingInfoDiv = document.getElementById('alternatingInfo');
    const alternatingMainTextSpan = document.getElementById('alternatingMainText');
    const alternatingSubTextSpan = document.getElementById('alternatingSubText');

    let currentInfoIndex = 0;
    const infoInterval = 5000;

    function calculateFullMoons(start, end) {
        const msPerDay = 1000 * 60 * 60 * 24;
        const days = Math.floor((end - start) / msPerDay);
        return Math.floor(days / 29.53);
    }

    function calculateWeekends(start, end) {
        let count = 0;
        let currentDate = new Date(start.getTime());
        currentDate.setHours(0, 0, 0, 0);

        while (currentDate.getTime() <= end.getTime()) {
            const dayOfWeek = currentDate.getDay();
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                count++;
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return count;
    }

    function numberToExtenso(num) {
        if (num === 0) return 'Zero';
        if (num < 0) return 'Menos ' + numberToExtenso(-num);

        const unidades = ['', 'Um', 'Dois', 'Três', 'Quatro', 'Cinco', 'Seis', 'Sete', 'Oito', 'Nove'];
        const dezenaEspecial = ['Dez', 'Onze', 'Doze', 'Treze', 'Quatorze', 'Quinze', 'Dezesseis', 'Dezessete', 'Dezoito', 'Dezenove'];
        const dezenas = ['', 'Dez', 'Vinte', 'Trinta', 'Quarenta', 'Cinquenta', 'Sessenta', 'Setenta', 'Oitenta', 'Noventa'];
        const centenas = ['', 'Cento', 'Duzentos', 'Trezentos', 'Quatrocentos', 'Quinhentos', 'Seiscentos', 'Setecentos', 'Oitocentos', 'Novecentos'];

        function toExtensoChunk(n) {
            let s = '';
            if (n >= 100) {
                s += centenas[Math.floor(n / 100)];
                if (n % 100 === 0 && n === 100) s = 'Cem';
                else if (n % 100 !== 0) s += ' e ';
                n %= 100;
            }
            if (n >= 20) {
                s += dezenas[Math.floor(n / 10)];
                if (n % 10 !== 0) s += ' e ' + unidades[n % 10];
            } else if (n >= 10) {
                s += dezenaEspecial[n - 10];
            } else if (n > 0) {
                s += unidades[n];
            }
            return s;
        }

        let partes = [];
        let tempNum = num;

        const milhao = 1000000;
        const bilhao = 1000000000;

        if (num >= bilhao) {
            return num.toLocaleString('pt-BR');
        }

        if (num >= milhao) {
            let numMilhoes = Math.floor(num / milhao);
            partes.push(toExtensoChunk(numMilhoes) + (numMilhoes > 1 ? ' Milhões' : ' Milhão'));
            tempNum %= milhao;
        }

        if (tempNum >= 1000) {
            let numMil = Math.floor(tempNum / 1000);
            if (numMil === 1) {
                partes.push('Mil');
            } else {
                partes.push(toExtensoChunk(numMil) + ' Mil');
            }
            tempNum %= 1000;
        }

        if (tempNum > 0 || partes.length === 0) {
            let ultimaParte = toExtensoChunk(tempNum);
            if (ultimaParte !== '') {
                 if (partes.length > 0 && tempNum < 100 && tempNum > 0) {
                     partes[partes.length -1] += ' e ' + ultimaParte;
                 } else if (partes.length > 0 && tempNum >= 100 && tempNum % 100 !== 0) {
                     partes.push('e ' + ultimaParte);
                 } else {
                     partes.push(ultimaParte);
                 }
            }
        }
        
        let result = partes.join(' ');
        result = result.replace(/Um Milhão/g, 'Um Milhão').replace(/Um Mil/g, 'Mil');

        return result.trim();
    }


    let _valentinesCount = 0;
    let _christmasCount = 0;
    let _fullMoons = 0;
    let _weekends = 0;
    let _totalHours = 0;
    let _totalMinutes = 0;
    let _totalSeconds = 0;
    let _currentYearsTogether = 0;

    function updateAllMetrics() {
        const now = new Date();
        const diff = now.getTime() - startDate.getTime();

        if (diff < 0) {
            yearsSpan.textContent = '0'; monthsSpan.textContent = '0'; daysSpan.textContent = '0';
            hoursSpan.textContent = '0'; minutesSpan.textContent = '0'; secondsSpan.textContent = '0';
            _valentinesCount = 0; _christmasCount = 0; _fullMoons = 0; _weekends = 0;
            _totalHours = 0; _totalMinutes = 0; _totalSeconds = 0; _currentYearsTogether = 0;
            return;
        }

        let currentYears = now.getFullYear() - startDate.getFullYear();
        let currentMonths = now.getMonth() - startDate.getMonth();
        let currentDaysInMonth = now.getDate() - startDate.getDate();

        if (currentDaysInMonth < 0) {
            currentMonths--;
            currentDaysInMonth += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
        }

        if (currentMonths < 0) {
            currentYears--;
            currentMonths += 12;
        }

        _totalSeconds = Math.floor(diff / 1000);
        _totalMinutes = Math.floor(_totalSeconds / 60);
        _totalHours = Math.floor(_totalMinutes / 60);

        // AQUI A LOGICA PARA YEARSCOMPLETED FOI MELHORADA PARA AS BODAS
        let yearsCompletedTemp = now.getFullYear() - startDate.getFullYear();
        if (now.getMonth() < startDate.getMonth() || 
           (now.getMonth() === startDate.getMonth() && now.getDate() < startDate.getDate())) {
            yearsCompletedTemp--;
        }
        _currentYearsTogether = Math.max(0, yearsCompletedTemp);


        const startOfCurrentDayRelationship = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startDate.getHours(), startDate.getMinutes(), startDate.getSeconds());
        let secondsSinceStartOfDay = Math.floor((now.getTime() - startOfCurrentDayRelationship.getTime()) / 1000);

        let hoursDisplay = Math.floor(secondsSinceStartOfDay / 3600);
        let minutesDisplay = Math.floor((secondsSinceStartOfDay % 3600) / 60);
        let secondsDisplay = secondsSinceStartOfDay % 60;

        if (secondsSinceStartOfDay < 0) {
            const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
            const diffFromTodayStart = now.getTime() - startOfToday.getTime();
            const secondsFromTodayStart = Math.floor(diffFromTodayStart / 1000);
            hoursDisplay = Math.floor(secondsFromTodayStart / 3600);
            minutesDisplay = Math.floor((secondsFromTodayStart % 3600) / 60);
            secondsDisplay = secondsFromTodayStart % 60;
        }

        _valentinesCount = 0;
        const valentinesDayMonth = 0; // Janeiro (0-indexed)
        const valentinesDayDate = 15; // Dia 15

        for (let year = startDate.getFullYear(); year <= now.getFullYear(); year++) {
            const currentValentinesDay = new Date(year, valentinesDayMonth, valentinesDayDate, 0, 0, 0);
            if (currentValentinesDay.getTime() >= startDate.getTime() && currentValentinesDay.getTime() <= now.getTime()) {
                _valentinesCount++;
            }
        }
        const currentYearValentinesDay = new Date(now.getFullYear(), valentinesDayMonth, valentinesDayDate, 0, 0, 0);
        if (currentYearValentinesDay.getTime() > now.getTime() && _valentinesCount > 0) {
            _valentinesCount--;
        }

        _christmasCount = 0;
        const christmasMonth = 11;
        const christmasDate = 25;
        for (let year = startDate.getFullYear(); year <= now.getFullYear(); year++) {
            const currentChristmas = new Date(year, christmasMonth, christmasDate, 0, 0, 0);
            if (currentChristmas.getTime() >= startDate.getTime() && currentChristmas.getTime() <= now.getTime()) {
                _christmasCount++;
            }
        }
        const currentYearChristmas = new Date(now.getFullYear(), christmasMonth, christmasDate, 0, 0, 0);
        if (currentYearChristmas.getTime() > now.getTime() && _christmasCount > 0) {
            _christmasCount--;
        }

        _fullMoons = calculateFullMoons(startDate, now);
        _weekends = calculateWeekends(startDate, now);

        yearsSpan.textContent = currentYears;
        monthsSpan.textContent = currentMonths;
        daysSpan.textContent = currentDaysInMonth;
        hoursSpan.textContent = hoursDisplay;
        minutesSpan.textContent = minutesDisplay;
        secondsSpan.textContent = secondsDisplay;
    }

    function animateInfo() {
        const infoItems = [
            { main: `${_valentinesCount} dias dos namorados`, sub: '(15 de Janeiro)' },
            { main: `${_christmasCount} natais`, sub: '(25 de Dezembro)' },
            { main: `${_weekends} finais de semana`, sub: 'Sábados/Domingos' },
            { main: `${_fullMoons} luas cheias`, sub: '(aprox. 29.5 dias/ciclo)' },
            { main: `${_totalHours.toLocaleString()} horas juntos`, sub: `${numberToExtenso(_totalHours)}` },
            { main: `${_totalMinutes.toLocaleString()} minutos juntos`, sub: `${numberToExtenso(_totalMinutes)}` },
            { main: `${_totalSeconds.toLocaleString()} segundos juntos`, sub: `${numberToExtenso(_totalSeconds)}` }
        ];

        alternatingInfoDiv.classList.add('animate-twist');
        setTimeout(() => {
            currentInfoIndex = (currentInfoIndex + 1) % infoItems.length;
            const nextInfo = infoItems[currentInfoIndex];
            alternatingMainTextSpan.textContent = nextInfo.main;
            alternatingSubTextSpan.textContent = nextInfo.sub;

            alternatingInfoDiv.classList.remove('animate-twist');
            alternatingInfoDiv.classList.add('animate-untwist');
            setTimeout(() => {
                alternatingInfoDiv.classList.remove('animate-untwist');
            }, 500);

        }, 500);
    }

    updateAllMetrics();
    alternatingMainTextSpan.textContent = `${_valentinesCount} dias dos namorados`;
    alternatingSubTextSpan.textContent = '(15 de Janeiro)';

    setInterval(updateAllMetrics, 1000);
    setInterval(animateInfo, infoInterval);

    // --- Lógica do Carrossel de Fotos ---
    const photoGallery = document.getElementById('photoGallery');
    let isDownPhotos = false;
    let startXPhotos;
    let scrollLeftPhotos;

    const imageWidth = 256;
    const gapWidth = 12;
    const itemWidthPhotos = imageWidth + gapWidth;

    const numDuplicatesPhotos = 3;

    const totalImagesInGallery = photoGallery.children.length;
    const originalContentWidthPhotos = (totalImagesInGallery - (numDuplicatesPhotos * 2)) * itemWidthPhotos;

    const originalContentStartPhotos = numDuplicatesPhotos * itemWidthPhotos;
    const originalContentEndPhotos = originalContentStartPhotos + originalContentWidthPhotos;

    function checkLoopPhotos() {
        if (photoGallery.scrollLeft <= 0) {
            photoGallery.scrollLeft = originalContentEndPhotos - photoGallery.clientWidth + (photoGallery.clientWidth % itemWidthPhotos);
        } else if (photoGallery.scrollLeft + photoGallery.clientWidth >= photoGallery.scrollWidth - (itemWidthPhotos / 2)) {
            photoGallery.scrollLeft = originalContentStartPhotos;
        }
    }

    photoGallery.addEventListener('scroll', checkLoopPhotos);
    window.addEventListener('load', () => {
        photoGallery.scrollLeft = originalContentStartPhotos;
    });

    photoGallery.addEventListener('mousedown', (e) => {
        isDownPhotos = true;
        photoGallery.classList.add('active:cursor-grabbing');
        startXPhotos = e.pageX - photoGallery.offsetLeft;
        scrollLeftPhotos = photoGallery.scrollLeft;
    });

    photoGallery.addEventListener('mouseleave', () => {
        isDownPhotos = false;
        photoGallery.classList.remove('active:cursor-grabbing');
    });

    photoGallery.addEventListener('mouseup', () => {
        isDownPhotos = false;
        photoGallery.classList.remove('active:cursor-grabbing');
    });

    photoGallery.addEventListener('mousemove', (e) => {
        if (!isDownPhotos) return;
        e.preventDefault();
        const x = e.pageX - photoGallery.offsetLeft;
        const walk = (x - startXPhotos) * 1.5;
        photoGallery.scrollLeft = scrollLeftPhotos - walk;
    });

    let touchStartXPhotos;
    let touchScrollLeftPhotos;

    photoGallery.addEventListener('touchstart', (e) => {
        touchStartXPhotos = e.touches[0].pageX - photoGallery.offsetLeft;
        touchScrollLeftPhotos = photoGallery.scrollLeft;
    });

    photoGallery.addEventListener('touchmove', (e) => {
        if (!e.touches[0]) return;
        e.preventDefault();
        const x = e.touches[0].pageX - photoGallery.offsetLeft;
        const walk = (x - touchStartXPhotos) * 1.5;
        photoGallery.scrollLeft = touchScrollLeftPhotos - walk;
    });


    // --- NOVA LÓGICA: Carrossel de Bodas ---
    const bodasGallery = document.getElementById('bodasGallery');
    const bodaModal = document.getElementById('bodaModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalBodaTitle = document.getElementById('modalBodaTitle');
    const modalBodaDescription = document.getElementById('modalBodaDescription');


    // Lista de Bodas com descrições
    const bodasData = [
        { name: "Papel", description: "Representa a fragilidade do início e a necessidade de escrever uma nova história juntos." },
        { name: "Algodão", description: "Simboliza a flexibilidade e a união que começa a se consolidar." },
        { name: "Trigo", description: "Significa a prosperidade e a união, assim como os grãos de trigo que se unem para formar o pão." },
        { name: "Linho", description: "Reflete a maleabilidade e a resistência do tecido, que se torna mais forte com o tempo." },
        { name: "Madeira ou Ferro", description: "Marca a solidez e a durabilidade do relacionamento, que se fortalece com o tempo." },
        { name: "Perfume ou Açúcar", description: "Representa a doçura e a alegria que perfumam a vida a dois." },
        { name: "Latão ou Lã", description: "Simboliza a adaptabilidade e o aconchego que o casal oferece um ao outro." },
        { name: "Papoula ou Barro", description: "Expressa a beleza da vida e a capacidade de moldar o relacionamento com amor." },
        { name: "Cerâmica ou Vime", description: "Representa a maleabilidade e a arte de construir uma vida em conjunto." },
        { name: "Estanho", description: "Significa a maleabilidade e a preservação do amor." },
        { name: "Aço", description: "Simboliza a resistência e a força inabalável da união." },
        { name: "Seda ou Ônix", description: "Representa a delicadeza e a preciosidade do amor que se aprofunda." },
        { name: "Linho ou Renda", description: "Reflete a elegância e a complexidade dos laços que se entrelaçam." },
        { name: "Marfim", description: "Simboliza a beleza rara e a durabilidade do compromisso." },
        { name: "Cristal", description: "Representa a transparência, a pureza e a beleza do amor." },
        { name: "Turmalina", description: "Simboliza a energia vibrante e a capacidade de superação do casal." },
        { name: "Rosa", description: "Marca a beleza e a paixão que florescem continuamente." },
        { name: "Turquesa", description: "Representa a sorte, a proteção e a felicidade na união." },
        { name: "Cretone ou Água-marinha", description: "Simboliza a calmaria e a profundidade dos sentimentos." },
        { name: "Porcelana", description: "Reflete a beleza e a delicadeza que devem ser preservadas." },
        { name: "Zircão", description: "Representa a capacidade de brilhar e a singularidade do amor." },
        { name: "Louça", description: "Simboliza a utilidade e a beleza do cotidiano a dois." },
        { name: "Palha", description: "Expressa a simplicidade e a leveza do relacionamento." },
        { name: "Opala", description: "Reflete a diversidade e a beleza multifacetada do amor." },
        { name: "Prata", description: "Marca a resistência e a preciosidade de um amor duradouro." },
        { name: "Alexandrita", description: "Simboliza a adaptabilidade e a transformação do amor." },
        { name: "Crisopázio", description: "Representa a alegria e a capacidade de renovação." },
        { name: "Hematita", description: "Significa a força e a proteção do relacionamento." },
        { name: "Erva", description: "Reflete a capacidade de adaptação e o crescimento constante." },
        { name: "Pérola", description: "Simboliza a beleza rara e a paciência na construção do amor." },
        { name: "Nácar", description: "Representa o brilho e a delicadeza das camadas do amor." },
        { name: "Pinho", description: "Expressa a longevidade e a resistência do relacionamento." },
        { name: "Crizo", description: "Reflete a beleza oculta e o valor inestimável da união." },
        { name: "Oliveira", description: "Simboliza a paz, a sabedoria e a longevidade do amor." },
        { name: "Coral", description: "Representa a beleza, a força e a vitalidade da união." },
        { name: "Cedro", description: "Significa a nobreza e a perenidade do compromisso." },
        { name: "Aventurina", description: "Simboliza a boa sorte e as oportunidades que surgem na vida a dois." },
        { name: "Carvalho", description: "Representa a força, a resistência e a imponência do amor." },
        { name: "Mármore", description: "Reflete a beleza duradoura e a solidez inabalável do relacionamento." },
        { name: "Esmeralda", description: "Simboliza o amor verdadeiro, a esperança e a renovação." },
        { name: "casamento de Seda", description: "Expressa a fluidez e a suavidade de um amor que se aprofunda." },
        { name: "Prata Dourada", description: "Representa a beleza e o valor de um amor que transcende." },
        { name: "Azeviche", description: "Simboliza a proteção e a resiliência em face dos desafios." },
        { name: "Carbonato", description: "Reflete a formação e a estabilidade da união." },
        { name: "Rubi", description: "Marca a paixão intensa, a vitalidade e a força do amor." },
        { name: "Alabastro", description: "Representa a pureza e a beleza intrínseca do relacionamento." },
        { name: "Jaspe", description: "Simboliza a força, a estabilidade e a proteção mútua." },
        { name: "Granito", description: "Expressa a solidez e a durabilidade inabalável da união." },
        { name: "Heliotrópio", description: "Reflete a adaptabilidade e a capacidade de superação do casal." },
        { name: "Ouro", description: "Simboliza a eternidade, o valor inestimável e a perfeição do amor." },
        { name: "Bronze", description: "Representa a durabilidade e a resistência de um amor que se solidifica." },
        { name: "Argila", description: "Expressa a capacidade de moldar e construir o futuro a dois." },
        { name: "Antimônio", description: "Simboliza a purificação e a renovação constante do amor." },
        { name: "Níquel", description: "Reflete a resistência à corrosão e a durabilidade da união." },
        { name: "Ametista", description: "Representa a espiritualidade, a paz e a proteção no relacionamento." },
        { name: "Malaquita", description: "Simboliza a transformação e o crescimento contínuo do amor." },
        { name: "Lápis Lazuli", description: "Expressa a sabedoria, a verdade e a harmonia na união." },
        { name: "Vidro", description: "Reflete a transparência, a fragilidade e a beleza que devem ser cultivadas." },
        { name: "Cereja", description: "Simboliza a doçura e a vitalidade do amor que se mantém." },
        { name: "Diamante", description: "Representa a indestrutibilidade, a pureza e a eternidade do amor." },
        { name: "Cobre", description: "Expressa a maleabilidade e a condutividade do amor." },
        { name: "Telurita", description: "Reflete a conexão com a terra e a estabilidade da união." },
        { name: "Sândalo ou Lilás", description: "Simboliza a serenidade e a fragrância de um amor que perdura." },
        { name: "Fabulita", description: "Representa a raridade e a preciosidade de um amor único." },
        { name: "Platina", description: "Expressa a raridade, a pureza e a resistência de um amor incomparável." },
        { name: "Ébano", description: "Reflete a solidez e a escuridão que revela a força interior." },
        { name: "Neve", description: "Simboliza a pureza e a beleza efêmera que se renova." },
        { name: "Chumbo", description: "Representa a maleabilidade e a capacidade de se adaptar." },
        { name: "Mercúrio", description: "Expressa a fluidez e a capacidade de se transformar." },
        { name: "Vinho", description: "Reflete a maturação e o sabor de um amor que melhora com o tempo." },
        { name: "Zinco", description: "Simboliza a proteção e a resistência à corrosão." },
        { name: "Aveia", description: "Representa a simplicidade e a nutrição do amor diário." },
        { name: "Manjerona", description: "Expressa a felicidade e o bem-estar no relacionamento." },
        { name: "Macieira", description: "Reflete a fertilidade, a abundância e a doçura do amor." },
        { name: "Brilhante", description: "Simboliza a luz, o esplendor e a perfeição do amor." },
        { name: "Cipreste", description: "Representa a imortalidade e a resiliência da união." },
        { name: "Alfazema", description: "Expressa a calma, a purificação e a leveza do amor." },
        { name: "Benjoim", description: "Reflete a proteção e a fragrância de um amor duradouro." },
        { name: "Café", description: "Simboliza a energia, o aconchego e a paixão que revitaliza." },
        { name: "Nogueira ou Carvalho", description: "Representa a sabedoria, a força e a longevidade do amor." },
        { name: "Cacau", description: "Expressa a doçura e a riqueza dos momentos compartilhados." },
        { name: "Cravo", description: "Reflete a paixão, a admiração e a beleza do amor." },
        { name: "Begônia", description: "Simboliza a delicadeza e a beleza do relacionamento." },
        { name: "Crisântemo", description: "Representa a alegria, a longevidade e a felicidade na união." },
        { name: "Girassol", description: "Expressa a vitalidade, a alegria e a constante busca pela luz do amor." },
        { name: "Hortênsia", description: "Reflete a gratidão, a abundância e a beleza dos sentimentos." },
        { name: "Nogueira", description: "Simboliza a sabedoria e a força de um amor maduro." },
        { name: "Pêra", description: "Representa a doçura, a abundância e a forma única do amor." },
        { name: "Figueira", description: "Expressa a fertilidade, a sabedoria e a proteção do amor." },
        { name: "Álamo", description: "Reflete a resiliência e a capacidade de crescer juntos." },
        { name: "Pinheiro", description: "Simboliza a longevidade e a resistência às adversidades." },
        { name: "Salgueiro", description: "Representa a flexibilidade e a capacidade de se adaptar." },
        { name: "Imbuia", description: "Expressa a nobreza e a durabilidade de um amor sólido." },
        { name: "Palmeira", description: "Reflete a vitória, a prosperidade e a beleza exótica do amor." },
        { name: "Sândalo", description: "Simboliza a serenidade e a fragrância espiritual do amor." },
        { name: "Oliveira", description: "Representa a paz, a sabedoria e a eternidade do amor." },
        { name: "Abeto", description: "Expressa a longevidade e a resistência, mesmo nas condições mais difíceis." },
        { name: "Pinheiro", description: "Simboliza a vitalidade e a força da união." },
        { name: "Salgueiro", description: "Representa a adaptabilidade e a capacidade de superar desafios." },
        { name: "Jequitibá", description: "Expressa a grandiosidade, a longevidade e a majestade de um amor centenário." }
    ];

    // Mapeamento de nome da boda para o caminho da imagem
    const bodaImageMap = {
        "Papel": "imagens/papel.png", "Algodão": "algodao.png", "Trigo": "trigo.png", "Linho": "linho.png",
        "Madeira ou Ferro": "madeira.png", "Perfume ou Açúcar": "perfume.png", "Latão ou Lã": "latao.png",
        "Papoula ou Barro": "papoula.png", "Cerâmica ou Vime": "ceramica.png", "Estanho": "estanho.png",
        "Aço": "aco.png", "Seda ou Ônix": "seda.png", "Linho ou Renda": "renda.png",
        "Marfim": "marfim.png", "Cristal": "cristal.png", "Turmalina": "turmalina.png",
        "Rosa": "rosa.png", "Turquesa": "turquesa.png", "Cretone ou Água-marinha": "aguamarinha.png",
        "Porcelana": "porcelana.png", "Zircão": "zircao.png", "Louça": "louca.png",
        "Palha": "palha.png", "Opala": "opala.png", "Prata": "prata.png",
        "Alexandrita": "alexandrita.png", "Crisopázio": "crisopazio.png", "Hematita": "hematita.png",
        "Erva": "erva.png", "Pérola": "perola.png", "Nácar": "nacar.png",
        "Pinho": "pinho.png", "Crizo": "crizo.png", "Oliveira": "oliveira.png",
        "Coral": "coral.png", "Cedro": "cedro.png", "Aventurina": "aventurina.png",
        "Carvalho": "carvalho.png", "Mármore": "marmore.png", "Esmeralda": "esmeralda.png",
        "casamento de Seda": "casamento_seda.png", "Prata Dourada": "prata_dourada.png", "Azeviche": "azeviche.png",
        "Carbonato": "carbonato.png", "Rubi": "rubi.png", "Alabastro": "alabastro.png",
        "Jaspe": "jaspe.png", "Granito": "granito.png", "Heliotrópio": "heliotropio.png",
        "Ouro": "ouro.png", "Bronze": "bronze.png", "Argila": "argila.png",
        "Antimônio": "antimonio.png", "Níquel": "niquel.png", "Ametista": "ametista.png",
        "Malaquita": "malaquita.png", "Lápis Lazuli": "lapislazuli.png", "Vidro": "vidro.png",
        "Cereja": "cereja.png", "Diamante": "diamante.png", "Cobre": "cobre.png",
        "Telurita": "telurita.png", "Sândalo ou Lilás": "sandalo.png", "Fabulita": "fabulita.png",
        "Platina": "platina.png", "Ébano": "ebano.png", "Neve": "neve.png",
        "Chumbo": "chumbo.png", "Mercúrio": "mercurio.png", "Vinho": "vinho.png",
        "Zinco": "zinco.png", "Aveia": "aveia.png", "Manjerona": "manjerona.png",
        "Macieira": "macieira.png", "Brilhante": "brilhante.png", "Cipreste": "cipreste.png",
        "Alfazema": "alfazema.png", "Benjoim": "benjoim.png", "Café": "cafe.png",
        "Nogueira ou Carvalho": "nogueira.png", "Cacau": "cacau.png", "Cravo": "cravo.png",
        "Begônia": "begonia.png", "Crisântemo": "crisantemo.png", "Girassol": "girassol.png",
        "Hortênsia": "hortensia.png", "Nogueira": "nogueira_2.png", "Pêra": "pera.png",
        "Figueira": "figueira.png", "Álamo": "alamo.png", "Pinheiro": "pinheiro.png",
        "Salgueiro": "salgueiro.png", "Imbuia": "imbuia.png", "Palmeira": "palmeira.png",
        "Sândalo": "sandalo_2.png", "Oliveira": "oliveira_2.png", "Abeto": "abeto.png",
        // Adicione quaisquer nomes duplicados ou similares aqui para ter um mapeamento distinto
        "Pinheiro": "pinheiro_2.png", // Exemplo se tiver outro pinheiro
        "Salgueiro": "salgueiro_2.png", // Exemplo se tiver outro salgueiro
        "Jequitibá": "jequitiba.png"
    };

    const numDuplicatesBodas = 3;
    // O array `allBodas` agora é criado a partir de `bodasData.map(b => b.name)` para ter apenas os nomes
    const allBodasNames = [];
    for (let i = bodasData.length - numDuplicatesBodas; i < bodasData.length; i++) {
        allBodasNames.push(bodasData[i].name);
    }
    allBodasNames.push(...bodasData.map(b => b.name));
    for (let i = 0; i < numDuplicatesBodas; i++) {
        allBodasNames.push(bodasData[i].name);
    }


    const bodaItemWidth = 250 + 24;
    const originalBodasContentWidth = bodasData.length * bodaItemWidth;

    const originalBodasStart = numDuplicatesBodas * bodaItemWidth;
    const originalBodasEnd = originalBodasStart + originalBodasContentWidth;


    function calculateBodasInfo() {
        const now = new Date();
        const startOfRelationshipYear = startDate.getFullYear();
        const startOfRelationshipMonth = startDate.getMonth();
        const startOfRelationshipDay = startDate.getDate();

        let yearsCompleted = now.getFullYear() - startOfRelationshipYear;
        if (now.getMonth() < startOfRelationshipMonth || 
           (now.getMonth() === startOfRelationshipMonth && now.getDate() < startOfRelationshipDay)) {
            yearsCompleted--;
        }
        yearsCompleted = Math.max(0, yearsCompleted);

        const bodaIndexForDisplay = yearsCompleted;
        
        // Verifica se a boda existe no array bodasData
        const currentBoda = bodasData[bodaIndexForDisplay];
        const nextBoda = bodasData[bodaIndexForDisplay + 1];

        const currentBodaName = currentBoda ? currentBoda.name : "Não Definida";
        const currentBodaDescription = currentBoda ? currentBoda.description : "Descrição não disponível.";

        const nextBodaName = nextBoda ? nextBoda.name : "Última Boda Atingida!";

        let nextAnniversaryDate = new Date(startOfRelationshipYear + yearsCompleted + 1, startOfRelationshipMonth, startOfRelationshipDay, startDate.getHours(), startDate.getMinutes(), startDate.getSeconds());
        
        const daysUntilNextAnniversary = Math.ceil((nextAnniversaryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));


        const startOfCurrentBodaYear = new Date(startOfRelationshipYear + yearsCompleted, startOfRelationshipMonth, startOfRelationshipDay, startDate.getHours(), startDate.getMinutes(), startDate.getSeconds());
        const endOfCurrentBodaYear = new Date(startOfRelationshipYear + yearsCompleted + 1, startOfRelationshipMonth, startOfRelationshipDay, startDate.getHours(), startDate.getMinutes(), startDate.getSeconds());

        const totalMsInCurrentBodaYear = endOfCurrentBodaYear.getTime() - startOfCurrentBodaYear.getTime();
        const msPassedInCurrentBodaYear = now.getTime() - startOfCurrentBodaYear.getTime();

        let progressPercentage = (msPassedInCurrentBodaYear / totalMsInCurrentBodaYear) * 100;
        progressPercentage = Math.max(0, Math.min(100, progressPercentage));
        
        return {
            yearsCompleted: yearsCompleted,
            currentBodaIndex: bodaIndexForDisplay,
            currentBodaName: currentBodaName,
            currentBodaDescription: currentBodaDescription, // Adicionado
            daysUntilNext: daysUntilNextAnniversary,
            nextBodaName: nextBodaName,
            progress: progressPercentage
        };
    }

    function renderBodas() {
        bodasGallery.innerHTML = '';
        const bodaInfo = calculateBodasInfo();

        allBodasNames.forEach((bodaName, index) => {
            const yearNum = index - numDuplicatesBodas + 1;

            const shouldRender = (yearNum > 0 && yearNum <= (bodaInfo.yearsCompleted + numDuplicatesBodas + 1) && yearNum >= (bodaInfo.yearsCompleted - numDuplicatesBodas)) || (index < numDuplicatesBodas || index >= allBodasNames.length - numDuplicatesBodas);

            if (shouldRender) {
                const bodaItem = document.createElement('div');
                bodaItem.classList.add('boda-item', 'w-64', 'h-64', 'bg-boda-bg', 'rounded-xl', 'shadow-lg', 'flex-shrink-0', 'p-4', 'flex', 'flex-col', 'items-center', 'justify-center', 'text-center', 'relative', 'overflow-hidden');
                
                const isCurrentBoda = (yearNum === bodaInfo.yearsCompleted + 1);

                if (isCurrentBoda) {
                    bodaItem.classList.add('border-4', 'border-boda-border');
                } else {
                    bodaItem.classList.add('border-2', 'border-gray-700');
                }

                // Obtém o caminho da imagem da boda
                let imageFileName = bodaImageMap[bodaName] || 'default.png'; 
                
                // Lógica específica para alguns nomes de boda com "ou"
                if (bodaName.includes(" ou ")) {
                     const firstPart = bodaName.split(' ou ')[0].trim();
                     imageFileName = bodaImageMap[firstPart] || 'default.png';

                     if (bodaName === "Nogueira ou Carvalho") {
                         imageFileName = bodaImageMap["Nogueira"] || 'default.png';
                     }
                     if (bodaName === "Sândalo ou Lilás") {
                        imageFileName = bodaImageMap["Sândalo"] || 'default.png';
                     }
                     if (bodaName === "Madeira ou Ferro") {
                        imageFileName = bodaImageMap["Madeira"] || 'default.png';
                     }
                     if (bodaName === "Perfume ou Açúcar") {
                        imageFileName = bodaImageMap["Perfume"] || 'default.png';
                     }
                     if (bodaName === "Latão ou Lã") {
                        imageFileName = bodaImageMap["Latão"] || 'default.png';
                     }
                     if (bodaName === "Papoula ou Barro") {
                        imageFileName = bodaImageMap["Papoula"] || 'default.png';
                     }
                     if (bodaName === "Cerâmica ou Vime") {
                        imageFileName = bodaImageMap["Cerâmica"] || 'default.png';
                     }
                     if (bodaName === "Seda ou Ônix") {
                        imageFileName = bodaImageMap["Seda"] || 'default.png';
                     }
                     if (bodaName === "Linho ou Renda") {
                        imageFileName = bodaImageMap["Linho"] || 'default.png';
                     }

                }
                
                const imagePath = `imagens/bodas/${imageFileName}`;

                bodaItem.innerHTML = `
                    <span class=" font-semibold text-lg md:text-xl absolute top-3 left-1/2 -translate-x-1/2">${yearNum} Anos</span>
                    <div class="flex flex-col items-center justify-center h-full">
                        <div class="w-16 h-16 rounded-full flex items-center justify-center mb-2">
                             <img src="${imagePath}" alt="${bodaName}" class="w-full h-full object-contain rounded-full">
                        </div>
                        <span class="text-accent-pink font-cursive text-3xl md:text-4xl leading-tight mb-2">${bodaName}</span>
                        ${isCurrentBoda ? `
                            <span class="text-gray-400 text-sm md:text-base">${bodaInfo.daysUntilNext} dias</span>
                            <span class="text-gray-400 text-sm md:text-base">para completar</span>
                        ` : ''}
                    </div>
                    <div class="absolute bottom-0 left-0 w-full h-2 bg-gray-700">
                        <div class="bg-progress-fill h-full" style="width: ${isCurrentBoda ? bodaInfo.progress : 0}%;"></div>
                    </div>
                    <button class="show-boda-info absolute bottom-2 text-xs text-gray-500 hover:text-gray-300 transition-colors" data-boda-name="${bodaName}">Significado</button>
                `;
                bodasGallery.appendChild(bodaItem);
            }
        });
        
        if (bodaInfo.yearsCompleted >= 0) {
            const bodaToCenterIndex = numDuplicatesBodas + bodaInfo.yearsCompleted;
            const bodaToCenter = bodasGallery.children[bodaToCenterIndex];
            if (bodaToCenter) {
                bodasGallery.scrollLeft = bodaToCenter.offsetLeft - (bodasGallery.clientWidth / 2) + (bodaToCenter.clientWidth / 2);
            }
        }
    }

    // Event listeners para abrir o modal
    bodasGallery.addEventListener('click', function(event) {
        const button = event.target.closest('.show-boda-info');
        if (button) {
            const bodaName = button.dataset.bodaName;
            const boda = bodasData.find(b => b.name === bodaName);
            if (boda) {
                modalBodaTitle.textContent = `Bodas de ${boda.name}`;
                modalBodaDescription.textContent = boda.description;
                bodaModal.classList.remove('hidden');
            }
        }
    });

    // Event listener para fechar o modal
    closeModalBtn.addEventListener('click', function() {
        bodaModal.classList.add('hidden');
    });

    // Fechar modal clicando fora
    bodaModal.addEventListener('click', function(event) {
        if (event.target === bodaModal) {
            bodaModal.classList.add('hidden');
        }
    });


    // Lógica do Carrossel de Bodas
    let isDownBodas = false;
    let startXBodas;
    let scrollLeftBodas;

    bodasGallery.addEventListener('scroll', checkLoopBodas);

    window.addEventListener('load', () => {
        renderBodas();
    });

    function checkLoopBodas() {
        if (bodasGallery.scrollLeft <= 0) {
            bodasGallery.scrollLeft = originalBodasEnd - bodasGallery.clientWidth + (bodasGallery.clientWidth % bodaItemWidth);
        } else if (bodasGallery.scrollLeft + bodasGallery.clientWidth >= bodasGallery.scrollWidth - (bodaItemWidth / 2)) {
            bodasGallery.scrollLeft = originalBodasStart;
        }
    }

    bodasGallery.addEventListener('mousedown', (e) => {
        isDownBodas = true;
        bodasGallery.classList.add('active:cursor-grabbing');
        startXBodas = e.pageX - bodasGallery.offsetLeft;
        scrollLeftBodas = bodasGallery.scrollLeft;
    });

    bodasGallery.addEventListener('mouseleave', () => {
        isDownBodas = false;
        bodasGallery.classList.remove('active:cursor-grabbing');
    });

    bodasGallery.addEventListener('mouseup', () => {
        isDownBodas = false;
        bodasGallery.classList.remove('active:cursor-grabbing');
    });

    bodasGallery.addEventListener('mousemove', (e) => {
        if (!isDownBodas) return;
        e.preventDefault();
        const x = e.pageX - bodasGallery.offsetLeft;
        const walk = (x - startXBodas) * 1.5;
        bodasGallery.scrollLeft = scrollLeftBodas - walk;
    });

    let touchStartXBodas;
    let touchScrollLeftBodas;

    bodasGallery.addEventListener('touchstart', (e) => {
        touchStartXBodas = e.touches[0].pageX - bodasGallery.offsetLeft;
        touchScrollLeftBodas = bodasGallery.scrollLeft;
    });

    bodasGallery.addEventListener('touchmove', (e) => {
        if (!e.touches[0]) return;
        e.preventDefault();
        const x = e.touches[0].pageX - bodasGallery.offsetLeft;
        const walk = (x - touchStartXBodas) * 1.5;
        bodasGallery.scrollLeft = touchScrollLeftBodas - walk;
    });

    setInterval(renderBodas, 60000);
    renderBodas();
});