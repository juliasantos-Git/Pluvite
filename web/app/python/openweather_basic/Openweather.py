import requests
API_key = ""
cidade = "Taubate"
link = f"https://api.openweathermap.org/data/2.5/weather?q={cidade}&appid={API_key}&lang=pt_br"
requisicao = requests.get(link)
requisicao_dic = requisicao.json()
descricao = requisicao_dic['weather'][0]['description']
temperatura = requisicao_dic['main']['temp'] -273.15
print(descricao, f"{temperatura}'C")



#aea3caae2787bef2039681102761e6d1