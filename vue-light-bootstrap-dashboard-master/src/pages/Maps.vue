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
  <div>
    <delivery></delivery>
    <div class="map-container">
      <div id="map1" class="map"></div>
      <div id="map2" class="map"></div>
      <div id="map3" class="map"></div>
      <div id="map4" class="map"></div>
    </div>
  </div>
</template>

<script>
import Delivery from 'src/pages/Delivery.vue'

export default {
  components: {
    Delivery
    },
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
        const mapOptions = {
          center: new kakao.maps.LatLng(33.450701, 126.570667),
          level: 3
        };

        // 첫 번째 지도 생성
        let map1 = new kakao.maps.Map(document.getElementById('map1'), mapOptions);

        // 두 번째 지도의 중심 좌표 조정
        mapOptions.center = new kakao.maps.LatLng(33.451701, 126.570667);
        let map2 = new kakao.maps.Map(document.getElementById('map2'), mapOptions);

        // 세 번째 지도의 중심 좌표 조정
        mapOptions.center = new kakao.maps.LatLng(33.450701, 126.571667);
        let map3 = new kakao.maps.Map(document.getElementById('map3'), mapOptions);

        // 네 번째 지도의 중심 좌표 조정
        mapOptions.center = new kakao.maps.LatLng(33.449701, 126.570667);
        let map4 = new kakao.maps.Map(document.getElementById('map4'), mapOptions);
      });
    }
  },
  }
};
</script>

<style scoped>
.map-container {
  display: flex;
  justify-content: space-around;
  flex-wrap: nowrap;
}

.map {
  width: 350px;
  height: 350px;
  margin: 5px;
  border: 1px solid #ccc; /* optional: adds a border around each map */
}
</style>


