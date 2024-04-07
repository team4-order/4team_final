<!-- <template>
  <gmap-map
    id="map"
    :center="center"
    :zoom="13"
    :options="options"
    map-type-id="terrain"
  >
    <gmap-marker :position="center">
    </gmap-marker>
  </gmap-map>
</template>

<script>
  import {API_KEY} from './Maps/API_KEY'
  import Vue from 'vue'
  import * as VueGoogleMaps from 'vue2-google-maps'
  Vue.use(VueGoogleMaps, {
    load: {
      key: API_KEY
    }
  })
  export default {
    data () {
      return {
        center: {
          lat: 40.748817,
          lng: -73.985428
        },
        options: {
          styles: [{
            'featureType': 'water',
            'stylers': [{'saturation': 43}, {'lightness': -11}, {'hue': '#0088ff'}]
          }, {
            'featureType': 'road',
            'elementType': 'geometry.fill',
            'stylers': [{'hue': '#ff0000'}, {'saturation': -100}, {'lightness': 99}]
          }, {
            'featureType': 'road',
            'elementType': 'geometry.stroke',
            'stylers': [{'color': '#808080'}, {'lightness': 54}]
          }, {
            'featureType': 'landscape.man_made',
            'elementType': 'geometry.fill',
            'stylers': [{'color': '#ece2d9'}]
          }, {
            'featureType': 'poi.park',
            'elementType': 'geometry.fill',
            'stylers': [{'color': '#ccdca1'}]
          }, {
            'featureType': 'road',
            'elementType': 'labels.text.fill',
            'stylers': [{'color': '#767676'}]
          }, {
            'featureType': 'road',
            'elementType': 'labels.text.stroke',
            'stylers': [{'color': '#ffffff'}]
          }, {'featureType': 'poi', 'stylers': [{'visibility': 'off'}]}, {
            'featureType': 'landscape.natural',
            'elementType': 'geometry.fill',
            'stylers': [{'visibility': 'on'}, {'color': '#b8cb93'}]
          }, {'featureType': 'poi.park', 'stylers': [{'visibility': 'on'}]}, {
            'featureType': 'poi.sports_complex',
            'stylers': [{'visibility': 'on'}]
          }, {'featureType': 'poi.medical', 'stylers': [{'visibility': 'on'}]}, {
            'featureType': 'poi.business',
            'stylers': [{'visibility': 'simplified'}]
          }]
        }
      }
    }
  }
</script>
<style>
  #map {
    min-height: calc(100vh - 123px);
  }
</style> -->

<!-- <template>
  <div>
    <div id="map" ref="map" class="map"></div>
    <div class="button-group">
      <button @click="changeSize(0)">Hide</button>
      <button @click="changeSize(400)">Show</button>
      <button @click="displayMarker(markerPositions1)">Marker Set 1</button>
      <button @click="displayMarker(markerPositions2)">Marker Set 2</button>
      <button @click="displayMarker([])">Marker Set 3 (Empty)</button>
    </div>
  </div>
</template> -->

<template>
  <div id="map" style="width:350px;height:350px;"></div>
</template>

<script>
export default {
  // name: "KakaoMap",
  // data() {
  //   return {
  //     markerPositions1: [
  //       [33.452278, 126.567803],
  //       [33.452671, 126.574792],
  //     ],
  //     markerPositions2: [
  //       [37.499590490909185, 127.0263723554437],
  //       [37.499427948430814, 127.02794423197847],
  //     ],
  //     markers: [],
  //     map: null,
  //   };
  // },
  // mounted() {
  //   this.loadKakaoMaps();
  // },
  async mounted() {
    try{
      
      this.loadKaKaoPostcodeScript();
      
    }catch(error){
      console.log(error);
    }
   
  },
  methods: {
    loadKaKaoPostcodeScript() {
    const script = document.createElement('script');
    script.type = "text/javascript";
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=5cb1741b9fe30c39afdd161bb6e135f2&libraries=services,clusterer&autoload=false`;

    document.head.appendChild(script);
    script.onload = () => {
      this.isScriptLoaded = true;
      // eslint-disable-next-line no-undef
      kakao.maps.load(() => {

        // 이곳에 지도 생성 코드를 넣습니다.
        this.initMap();
      });
    };
  },
    initMap() {
      if (this.isScriptLoaded) {
        window.kakao.maps.load(() => {
          // eslint-disable-next-line no-undef
          let map = new kakao.maps.Map(document.getElementById('map'), {
            center: new kakao.maps.LatLng(33.450701, 126.570667),
            level: 3
          });
        });
      }
    },
  },
};
</script>

<style scoped>
.map {
  width: 400px;
  height: 400px;
}

.button-group {
  margin: 10px 0px;
}

button {
  margin: 0 3px;
}
</style>

