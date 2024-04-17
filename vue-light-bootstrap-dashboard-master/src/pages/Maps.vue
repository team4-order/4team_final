<template>
  <div>
    <!-- Delivery 컴포넌트 추가 -->
    <delivery></delivery>
    <div class="map-container">
      <div id="map" class="map"></div>
    </div>
  </div>
</template>

<script>
import Delivery from 'src/pages/Delivery.vue'
import axios from 'axios'

export default {
  components: {
    Delivery
  },
  data() {
    return {
      isScriptLoaded: false
    };
  },
  async mounted() {
    try {
      // 카카오 지도 스크립트 로드
      await this.loadKaKaoPostcodeScript();
      // 지도 초기화
      this.initMap();
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    loadKaKaoPostcodeScript() {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.type = "text/javascript";
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=5cb1741b9fe30c39afdd161bb6e135f2&libraries=services,clusterer&autoload=false`;
        script.onload = () => {
          this.isScriptLoaded = true;
          resolve();
        };
        script.onerror = (error) => {
          reject(error);
        };
        document.head.appendChild(script);
      });
    },
    initMap() {
      if (this.isScriptLoaded) {
        kakao.maps.load(() => {
          const mapOptions = {
            center: new kakao.maps.LatLng(37.56595928, 126.97885624),
            level: 11
          };
          const map = new kakao.maps.Map(document.getElementById('map'), mapOptions);
          // 경로 찾기
          this.findRoute(map);
        });
      }
    },
    findRoute(map) {
      axios.get('https://apis-navi.kakaomobility.com/v1/directions', {
        params: {
          origin: '127.11409769110776,37.99269184820678',
          destination: '126.62974669101217,37.39996530012616',
          waypoints: '',
          priority: 'RECOMMEND',
          car_fuel: 'GASOLINE',
          car_hipass: false,
          alternatives: false,
          road_details: false
        },
        headers: {
          'Authorization': 'KakaoAK f74e4f598452c26325500e84e020e0fc',
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        const { result_code, summary, sections } = response.data.routes[0];
        if (sections[0]) {
          const { distance, duration, guides, roads } = sections[0];
          const detailRoads = [];
          for (let i = 0; i < roads.length; i++) {
            const arg = roads[i];
            const mini = arg.vertexes;
            let cursor = 0;
            while (cursor < mini.length) {
              const obj = new kakao.maps.LatLng(mini[cursor + 1], mini[cursor]);
              detailRoads.push(obj);
              cursor = cursor + 2;
              if (cursor >= 1000000) break;
            }
          }
          // 가이드 수정
          const modifiedGuides = guides.map(arg => {
            const { x, y } = arg;
            if (x && y) {
              arg.position = new kakao.maps.LatLng(arg.y, arg.x);
            }
            return arg;
          });
          const { title, position } = modifiedGuides[0];
          const imageSize = new kakao.maps.Size(24, 35);
          const image = new kakao.maps.MarkerImage('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/red_b.png', imageSize);
          const marker1 = new kakao.maps.Marker({
            map,
            position,
            title: title ? title : '',
            image
          });
          const { title: title2, position: position2 } = modifiedGuides[modifiedGuides.length - 1];
          const image2 = new kakao.maps.MarkerImage('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/blue_drag.png', imageSize);
          const marker2 = new kakao.maps.Marker({
            map,
            position: position2,
            title: title2 ? title2 : '',
            image: image2
          });
          const polyline = new kakao.maps.Polyline({
            path: detailRoads,
            strokeWeight: 5,
            strokeColor: 'red',
            strokeOpacity: 0.7,
            strokeStyle: 'solid'
          });
          polyline.setMap(map);
          // 커스텀 오버레이 추가
          const customOverlay = new kakao.maps.CustomOverlay({
            position: new kakao.maps.LatLng(37.39843974939604, 127.10972941510465),
             content: `<div class="label" style="background-color: white;">거리: ${distance}km, 소요 시간: ${Math.floor(duration / 3600)}시간 ${Math.floor((duration % 3600) / 60)}분</div>` // 배경 색상 추가
          });
          customOverlay.setMap(map);
        }
      })
      .catch(error => {
        console.log(error);
      });
    }
  }
};
</script>

<style scoped>
.map-container {
  margin-left: 3%;
  display: flex;
  justify-content: flex-start; /* 왼쪽으로 정렬 */
  flex-wrap: nowrap;
  width: 66.666%; /* 전체 너비의 2/3을 차지 */
  height: 500px; /* 높이를 500px로 설정 */
}

.map {
  width: 100%;
  height: 100%;
  margin: 5px;
  border: 1px solid #ccc; /* optional: adds a border around each map */
}
</style>
