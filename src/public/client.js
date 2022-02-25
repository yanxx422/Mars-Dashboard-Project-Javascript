let store = Immutable.Map({
    rover_name: '',
    status:  '',
    launch_date: '',
    landing_date: '',
    earth_date: '',
    photos: '',
});

// add our markup to the page
const root = document.getElementById('root')


const updateStore = (store, newState) => {
    store = store.merge(newState)
    render(root, store)
}


const render = async (root, state) => {
    root.innerHTML = App(state)

}


function roverInfo_html(state) {
    return `
    <p>Status:
        ${state.get('status')}
    </p>
    <p>Launch Date:
        ${state.get('launch_date')}
    </p>
    <p>Landing Date:
        ${state.get('landing_date')}
    </p>
    <p>Most Recent Photo Date:
        ${state.get('earth_date')}
    </p>
    `;
}


function roverImage_html(state){
    //Original intention is to take most recent 4 photos
    const img_urls = state.get('photos').toArray().slice(0,4)
    return img_urls
}


// create content
const App = (state) => {
    if(state.get('rover_name') === ''){
        return initialization_html;
    } else {
        //Some rovers only have 1 photo so here only shows one photo instead of 4..
        return `
            <header>
            <h1> NASA Mars Dashboard</h1>
            </header>
            <main class = "container">
                <section>
                ${roverInfo_html(state)}
                </section>
                <p> Most Recent Picture: </p>
                <div class = "image-row">
                    <div class = "column">
                    <img src =${roverImage_html(state)[0]} width:auto height: 100% object-fit: cover>
                </div>

            </main>
        
        `
    }
}


async function fetchData(roverName) {
    let data = fetch(`/get${roverName}`)
        .then(res => res.json())
        .then((data) => ({
            [roverName]: data,
        })).catch((err) => console.error(err));

    return data;
}


const getData = async(roverName)=> {
    const current_data =  await fetchData(roverName);
    const latest_entry =  Object.values(Object.values(current_data)[0]['image']['latest_photos']);
    updateStore(store, {
        rover_name: roverName,
        status:  latest_entry[0].rover.status,
        launch_date: latest_entry[0].rover.launch_date,
        landing_date: latest_entry[0].rover.landing_date,
        earth_date: latest_entry[0].earth_date,
        photos: latest_entry.map((photo) => {
            return photo.img_src;
        }),
    });
}


window.addEventListener('load', () => {
    render(root, store);
    document.getElementById('curiosity').addEventListener('click', () => getData('Curiosity'))
    document.getElementById('perseverance').addEventListener('click', () => getData('Perseverance'))
    document.getElementById('opportunity').addEventListener('click', () => getData('Opportunity'))
});


const initialization_html = `
            <header>
                <h1> NASA Mars Dashboard</h1>
            </header>
            <main class = "container">
                <section>
                    <div class="rover-row">
                        <div class = "rover-grid_item__card">
                            <img src = "curiosity.jpg" alt = "curiosity rover" class="rounded-corners">
                            <h4>Curiosity Rover</h4>
                            <p>Curiosity is a car-sized Mars rover designed to explore the Gale crater on Mars as part of NASA's Mars Science Laboratory mission. Curiosity was launched from Cape Canaveral on 26 November 2011, at 15:02:00 UTC and landed on Aeolis Palus inside Gale crater on Mars on 6 August 2012, 05:17:57 UTC. </p>
                            <a class="button" id="curiosity" >Curiosity</a>
                        </div>
                        <div class = "rover-grid_item__card">
                            <img src = "perseverance.jpg" alt = "perseverance rover" class="rounded-corners">
                            <h4>Perseverance Rover</h4>
                            <p>Perseverance is a car-sized Mars rover designed to explore the crater Jezero on Mars as part of NASA's Mars 2020 mission. It was manufactured by the Jet Propulsion Laboratory and launched on 30 July 2020, at 11:50 UTC. Confirmation that the rover successfully landed on Mars was received on 18 February 2021, at 20:55 UTC. </p>
                            <a class="button" id="perseverance">Perseverance</a>
                        </div>
                        <div class = "rover-grid_item__card">
                            <img src = "opportunity.jpg" alt = "opportunity rover" class="rounded-corners">
                            <h4>Opportunity Rover</h4>
                            <p>Opportunity, also known as MER-B or MER-1, and nicknamed Oppy, is a robotic rover that was active on Mars from 2004 until mid-2018. Opportunity was operational on Mars for 5110 sols.</p>
                            <a class="button" id="opportunity">Opportunity</a>
                        </div>
                    </div>

                </section>

            </main>

            `
