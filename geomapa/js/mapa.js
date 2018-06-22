var geocoder = new google.maps.Geocoder(); // utilizando o geocoder é possível retornar a lat e lng de endereços indicados pelo autocomplete
var map; // variável do mapa
var directionsDisplay; // Renderizador de rotas do google maps.
var directionsService = new google.maps.DirectionsService();
var latlng = new google.maps.LatLng(-18.8800397, -47.05878999999999);
var marker = new google.maps.Marker();

function initialize() {
    directionsDisplay = new google.maps.DirectionsRenderer();
    
    var options = {
        zoom: 5,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP // definindo o tipo do mapa
    };

    map = new google.maps.Map(document.getElementById("mapa"), options);
    directionsDisplay.setMap(map); // relacionando o Renderizador de rotas com o mapa
}

$(document).ready(function () {
    initialize();

    $("form").submit(function (event) {
        event.preventDefault();

        var enderecoPartida = $("#txtEnderecoPartida").val();
        var enderecoChegada = $("#txtEnderecoChegada").val();

        definirRota(enderecoPartida, enderecoChegada);
    });

    $("#txtEnderecoPartida").autocomplete({
        source: carregarSource,
        select: carregarSelect 
    });
    $("#txtEnderecoChegada").autocomplete({
        source: carregarSource,
        select: carregarSelect
    });
});

/** Define uma rota entre dois pontos (partida, chegada) utilizando o directionsService */
function definirRota(partida, chegada) {
    marker.setMap(null);
    var request = {
        origin: partida, // ponto de origem
        destination: chegada, // ponto de destino
        travelMode: google.maps.TravelMode.DRIVING // definindo o meio de transporte para que a API do google maps defina a rota correta
    };
    directionsService.route(request, function (result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(result); // Mostrando o resultado
        }
    });
}

/** Popula opções do jquery autocomplete */
function carregarSource(request, response) {
    // sistema do google de indicação de endereços ao pesquisar, utilizado para o ponto de partida
    geocoder.geocode({
        'address': request.term + ', Brasil',
        'region': 'BR'
    }, function (results, status) {
        response(results.map(function (item) {
            return {
                label: item.formatted_address,
                value: item.formatted_address,
                latitude: item.geometry.location.lat(),
                longitude: item.geometry.location.lng()
            }
        }));
    })
}

/** Seleciona no mapa a opção selecionada no jquery autocomplete */
function carregarSelect(event, ui) {
    var location = new google.maps.LatLng(ui.item.latitude, ui.item.longitude);
    marker.setPosition(location);
    map.setCenter(location);
    map.setZoom(16);
    marker.setMap(map);
}