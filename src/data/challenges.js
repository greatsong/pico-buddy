// 센서별 미니 챌린지 — 재밌는 탐구 문제
const CHALLENGES = {
  LED: [
    {
      id: "LED_blink_speed",
      type: "mission",
      emoji: "🚦",
      question: "LED가 1초에 3번 깜빡이게 만들어보세요! time.sleep()의 숫자를 바꿔보세요.",
      hint: "1초에 3번이면... 켜기+끄기 한 세트가 약 0.33초!",
      solution: "time.sleep(0.17)로 바꾸면 1초에 약 3번 깜빡여요!",
    },
    {
      id: "LED_morse",
      type: "mission",
      emoji: "📡",
      question: "LED로 SOS 모스 부호를 보내보세요! (짧게 3번, 길게 3번, 짧게 3번)",
      hint: "짧게 = 0.2초, 길게 = 0.6초로 해보세요",
      solution: "짧게(0.2초) 3번 → 길게(0.6초) 3번 → 짧게(0.2초) 3번",
    },
  ],
  BUTTON: [
    {
      id: "BUTTON_counter",
      type: "mission",
      emoji: "🔢",
      question: "버튼을 누를 때마다 숫자가 1씩 올라가는 카운터를 만들어보세요!",
      hint: "count = 0을 만들고, 버튼 눌릴 때마다 count += 1",
      solution: "count 변수를 만들고 if btn.value() == 0: count += 1; print(count)",
    },
    {
      id: "BUTTON_led_toggle",
      type: "mission",
      emoji: "💡",
      question: "버튼을 누르면 LED가 켜지고, 다시 누르면 꺼지게 만들어보세요!",
      hint: "led_on = False 변수를 만들고, 버튼 누를 때마다 True/False를 바꿔요",
      solution: "led_on = not led_on으로 상태를 반전시키고, led.value(led_on)으로 적용",
    },
  ],
  DHT20: [
    {
      id: "DHT20_predict",
      type: "predict",
      emoji: "🤔",
      question: "지금 이 교실의 온도가 몇 도일까요? 예측해보세요!",
      followUp: "코드를 실행해서 확인해볼까요? 예측이 맞았나요?",
    },
    {
      id: "DHT20_hand",
      type: "experiment",
      emoji: "🖐️",
      question: "손으로 센서를 감싸면 온도가 올라갈까요? 얼마나 올라갈까요?",
      followUp: "체온이 약 36.5°C니까, 센서를 감싸면 온도가 서서히 올라가요! 얼마나 올라갔나요?",
    },
    {
      id: "DHT20_comfort",
      type: "mission",
      emoji: "🏠",
      question: "쾌적한 환경인지 판단하는 프로그램을 만들어보세요! (온도 18~26°C, 습도 40~60%)",
      hint: "if temp >= 18 and temp <= 26 and humi >= 40 and humi <= 60:",
      solution: "조건문으로 온도와 습도 범위를 확인하고, '쾌적해요!' 또는 '환기가 필요해요!'를 출력",
    },
  ],
  SCD41: [
    {
      id: "SCD41_predict",
      type: "predict",
      emoji: "👥",
      question: "교실에 30명이 있으면 CO2가 높을까요 낮을까요? 왜 그럴까요?",
      followUp: "사람이 숨 쉴 때 CO2를 내보내니까, 사람이 많을수록 CO2가 높아져요!",
    },
    {
      id: "SCD41_breath",
      type: "experiment",
      emoji: "💨",
      question: "센서 앞에서 후~ 불어보세요. CO2 수치가 어떻게 변하나요?",
      followUp: "날숨에는 CO2가 약 4%(40,000ppm)나 들어있어서 수치가 확 올라가요!",
    },
    {
      id: "SCD41_ventilation",
      type: "mission",
      emoji: "🪟",
      question: "CO2가 1000ppm을 넘으면 '환기 필요!'를 출력하는 프로그램을 만들어보세요.",
      hint: "if co2 > 1000: print('환기 필요!')",
      solution: "if co2 > 1000: print('환기 필요!') else: print('공기 좋아요!')",
    },
  ],
  BMP280: [
    {
      id: "BMP280_weather",
      type: "predict",
      emoji: "🌤️",
      question: "기압이 높으면 날씨가 좋을까요 나쁠까요?",
      followUp: "고기압 = 맑은 날씨! 기압이 낮아지면 비가 올 수 있어요.",
    },
    {
      id: "BMP280_floor",
      type: "experiment",
      emoji: "🏢",
      question: "센서를 들고 1층에서 2층으로 올라가면 기압이 어떻게 변할까요?",
      followUp: "높이 올라갈수록 기압이 조금 낮아져요! 약 12m 올라가면 1hPa 정도 낮아져요.",
    },
    {
      id: "BMP280_altitude",
      type: "mission",
      emoji: "⛰️",
      question: "기압으로 대략적인 고도를 계산하는 프로그램을 만들어보세요!",
      hint: "고도(m) ≈ (1013.25 - 현재기압) × 8.3",
      solution: "altitude = (1013.25 - pressure) * 8.3 으로 대략적인 고도 계산 가능!",
    },
  ],
};

export default CHALLENGES;
