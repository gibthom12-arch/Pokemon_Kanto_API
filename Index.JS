const mapWidth = window.innerWidth;
const mapHeight = window.innerHeight;
const bounds = [ [0, 0], [mapHeight, mapWidth]];
let markers = [];
                
var map = L.map('map', { crs: L.CRS.Simple, maxBounds: bounds, maxBoundsViscosity: 0.9});
const image = L.imageOverlay('kanto.jpg', bounds).addTo(map);
map.fitBounds(bounds);
map.setMinZoom(map.getZoom());


// Creates markers for locations of searched pokemon
function Marker_Maker(KantoLoc){
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
    const KantoCoords = { 
        "kanto-route-2-south-towards-viridian-city": [340, 120],
        "kanto-power-plant-area": [80, 375],
        "kanto-pokecenter-area": [195, 105],
        "kanto-route-16-area": [500, 290]
    }

    Object.entries(KantoCoords).forEach(([location, coordinates]) => {
        
        KantoLoc.forEach(Pokelocation => {
            if (Pokelocation == location) {
                const marker = L.marker(coordinates).addTo(map);
                markers.push(marker);
            }
        });
    });
}

// function grabs data from API for searched pokemon
async function fetchData(){
    try{
        const pokemonName = document.getElementById("PokeName").value.toLowerCase();
        const response =  await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
        
        if (!response.ok) {
            throw new Error("Could not fetch resource");
        }

        const data = await response.json();
        const pokemonSprite = data.sprites.front_default;
        const imgElement = document.getElementById("pokemonSprite"); 

        imgElement.src = pokemonSprite;
        imgElement.style.display = "block";
        console.log(data);

        const LocDataCall = data.location_area_encounters;
        try{
            const Locresponse = await fetch(LocDataCall)

            if (!Locresponse.ok) {
                throw new Error("Could not retrieve location");
            }

            const StrLocation = await Locresponse.json();
            const  KantoLoc = StrLocation.filter(location => location.location_area.name.startsWith("kanto"))
            .map(location => location.location_area.name);
            console.log(KantoLoc);
            Marker_Maker(KantoLoc);
        }
        catch(error) {
            console.error(error);
        }
    }

    catch(error){
        console.error(error);
    }
}
