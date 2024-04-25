<template>
  <div>
    <!-- 배송 컴포넌트 추가 -->
    <div style="margin-top: 30px; margin-bottom: -90px;">
      <delivery></delivery>
    </div>
    <!-- 컨텐츠 컨테이너 -->
    <div class="content-container">
      <!-- 지도 컨테이너 -->
      <div class="map-container">
        <!-- 제목 -->
        <h3>배송 경로</h3>
        <p class="card-category">
          <div>거리: {{ (distance / 10000).toFixed(0) }}km, 소요 시간: {{ hours }}시간 {{ minutes }}분</div>
        </p>
        <!-- 지도 영역 -->
        <div id="map" class="map"></div>
      </div>
      <!-- 출고 등록 버튼 -->
      <button type="submit" class="btn btn-info btn-fill" @click="submitDelivery">
        출고 등록
      </button>
    </div>
  </div>
</template>

<script>
import Delivery from 'src/pages/Delivery.vue'; // Delivery 컴포넌트 가져오기
import axios from 'axios'; // Axios HTTP 클라이언트 가져오기

export default {
  components: {
    Delivery
  },
  data() {
    return {
      mutableBusinessId: '',
      isScriptLoaded: false,
      storageLatLong: null,
      customerLatLong: null,
      sLat: 0,
      sLong: 0,
      distance: 0, // 거리 데이터
      hours: 0, // 시간 데이터
      minutes: 0 // 분 데이터
    };
  },
  async mounted() {
    const storedId = localStorage.getItem("code") || sessionStorage.getItem("user");
    this.mutableBusinessId = storedId;
    await this.loadKaKaoPostcodeScript();
    kakao.maps.load(() => {
      this.initMap();
    });
  },
  methods: {
    loadKaKaoPostcodeScript() {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.type = "text/javascript";
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=5cb1741b9fe30c39afdd161bb6e135f2&libraries=services,clusterer&autoload=false`;
        script.onload = () => {
          this.isScriptLoaded = true;
          console.log("Kakao script loaded successfully.");
          resolve();
        };
        script.onerror = (error) => {
          console.error("Failed to load Kakao script:", error);
          reject(error);
        };
        document.head.appendChild(script);
      });
    },
    initMap() {
      if (this.isScriptLoaded) {
        const mapOptions = {
          center: new kakao.maps.LatLng(37.56595928, 126.97885624),
          level: 10
        };
        const map = new kakao.maps.Map(document.getElementById('map'), mapOptions);
        this.fetchData().then(() => {
          if (this.storageLatLong && this.customerLatLong) {
            this.findRoute(map);
          } else {
            console.error("위도와 경도 정보가 없습니다.");
          }
        });
      }
    },
    async fetchData() {
      try {
        const response = await axios.get(`http://ec2-13-209-231-193.ap-northeast-2.compute.amazonaws.com:8080/api/orders/id/${this.mutableBusinessId}/${this.$route.params.orderNumber}`);
        if (response && response.data) {
          const storageContact = response.data.storageContact;
          const customerContact = response.data.customerContact;
          if (storageContact && customerContact) {
            const storagePromise = this.getLatLong(storageContact.contactAddress, 'storage');
            const customerPromise = this.getLatLong(customerContact.contactAddress, 'customer');
            await Promise.all([storagePromise, customerPromise]);
          }
        } else {
          console.error("No data received from the API");
        }
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    },
    async getLatLong(address, type) {
      if (!address) {
        console.error(`${type} 주소가 제공되지 않았습니다.`);
        return Promise.reject(`${type} 주소가 제공되지 않았습니다.`);
      }
      return axios.get(`https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURI(address)}`, {
        withCredentials: false, // 이 부분을 추가하여 인증 정보를 포함하지 않도록 설정합니다
        headers: {
          'Authorization': 'KakaoAK c4297977a44e472f16e253b264138e76'
        }
      }).then(response => {
        if (response && response.data && response.data.documents.length > 0) {
          const lat = parseFloat(response.data.documents[0].y);
          const long = parseFloat(response.data.documents[0].x);
          this[`${type}LatLong`] = {lat, long};
          //console.log(this.storageLatLong);
          //this[`${type}LatLong1`] = { lat, long };
          //console.log(this.storageLatLong1);
          if (`${type}` == 'storage') {
            this.sLat = lat;
            this.sLong = long;
          }
        } else {
          console.error(`${type} 주소에 해당하는 위도와 경도를 찾을 수 없습니다.`);
          throw new Error(`${type} 주소에 해당하는 위도와 경도를 찾을 수 없습니다.`);
        }
      }).catch(error => {
        console.error(`${type} 주소의 위도와 경도를 가져오는 중 에러가 발생했습니다.`, error);
        throw error;
      });
    },
    findRoute(map) {
      if (!this.storageLatLong || !this.customerLatLong) {
        console.error('위도와 경도 정보가 없습니다.');
        return;
      }

      axios.get('https://apis-navi.kakaomobility.com/v1/directions', {
        withCredentials: false, // 이 부분을 추가하여 인증 정보를 포함하지 않도록 설정합니다
        params: {
          origin: `${this.storageLatLong.long},${this.storageLatLong.lat}`,
          destination: `${this.customerLatLong.long},${this.customerLatLong.lat}`,
          waypoints: '',
          priority: 'RECOMMEND',
          car_fuel: 'GASOLINE',
          car_hipass: false,
          alternatives: false,
          road_details: false
        },
        headers: {
          'Authorization': 'KakaoAK c4297977a44e472f16e253b264138e76',
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          const {result_code, summary, sections} = response.data.routes[0]; //distance : 미터단위, duration : 초 단위
          if (sections[0]) {
            const {distance, duration, guides, roads} = sections[0];
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
              const {x, y} = arg;
              if (x && y) {
                arg.position = new kakao.maps.LatLng(arg.y, arg.x);
              }
              return arg;
            });
            const {title, position} = modifiedGuides[0]; // 마커 이미지의 이미지 크기 입니다
            const imageSize = new kakao.maps.Size(24, 35); // 마커 이미지를 생성합니다
            const image = new kakao.maps.MarkerImage('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/red_b.png', imageSize); // 마커를 생성합니다
            const marker1 = new kakao.maps.Marker({
              map, // 마커를 표시할 지도
              position,
              title: title ? title : '', // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
              image // 마커 이미지
            });
            const {title: title2, position: position2} = modifiedGuides[modifiedGuides.length - 1];
            // 마커 이미지 생성
            const image2 = new kakao.maps.MarkerImage('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/blue_drag.png', imageSize);
            // 마커를 생성합니다
            const marker2 = new kakao.maps.Marker({
              map,
              position: position2,
              title: title2 ? title2 : '',
              image: image2
            });

            // 지도에 표시할 선을 생성합니다
            const polyline = new kakao.maps.Polyline({
              path: detailRoads,
              strokeWeight: 5,
              strokeColor: 'red',
              strokeOpacity: 0.7,
              strokeStyle: 'solid'
            });
            polyline.setMap(map);
            //커스텀 오버레이 추가
            this.distance = distance;
            this.hours = Math.floor(duration / 3600);
            this.minutes = Math.floor((duration % 3600) / 60);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    async submitDelivery() {
      try {
        const orderNumber = this.$route.params.orderNumber;
        const response = await axios.get(`http://ec2-13-209-231-193.ap-northeast-2.compute.amazonaws.com:8080/api/orders/id/${this.mutableBusinessId}/${orderNumber}`);

        if (response && response.data) {
          const customerContact = response.data.customerContact;
          console.log(customerContact); // customerContact 객체를 콘솔에 출력하여 확인

          if (customerContact && customerContact.contactAddress) {
            const deliveryAddress = customerContact.contactAddress;
            // 주소를 포함하여 POST 요청
            await axios.post(`http://ec2-13-209-231-193.ap-northeast-2.compute.amazonaws.com:8080/api/deliveries/delivery/${orderNumber}`, {
              deliveryAddress: deliveryAddress
            });
            this.$router.push('/admin/delivery'); // 페이지 이동
          } else {
            console.error('도착지 주소를 찾을 수 없습니다.');
          }
        } else {
          console.error('API 응답에서 주문 데이터를 가져올 수 없습니다.');
        }
      } catch (error) {
        console.error('출고 등록에 실패했습니다:', error);
      }
    },

  }
};
</script>

<!-- 스타일 부분 -->
<style scoped>
.content-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 3%; /* 여백 조정 */
  margin-bottom: 30px;
  margin-top: -10%;
}

.map-container {
  flex-grow: 1;
  height: 500px; /* 지도의 높이를 설정합니다. */
}

.map {
  width: 100%;
  height: 100%;
  border: 1px solid #ccc; /* 지도의 테두리 스타일을 정의합니다. */
}

.btn-info {
  margin-left: 60px; /* 버튼과 지도 사이의 간격을 조정합니다. */
  margin-top: 660px;
  width: 150px;
}
</style>
