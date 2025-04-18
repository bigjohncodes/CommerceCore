import json
import requests

header_request_raw = """accept:
*/*
accept-encoding:
gzip, deflate, br, zstd
accept-language:
en-US,en;q=0.9
af-ac-enc-dat:
3244ba4f1f9f50d5
af-ac-enc-sz-token:
hvMh8/CiHmXiNzj/oXqWiw==|U2Wc0eekSCZ08f3oN3N1lIFv82BqnkWodcLcuRzGYluHJOD6Tux+iIODWIai1nKOkGFhDF98p007ivBm2SY=|Ad72eAwBpUukwYAo|08|3
cookie:
_hjSessionUser_868286=eyJpZCI6ImY0ZDA2MmI5LWYyYmQtNTBjOC1iYmJkLWVlZWRmZTE1YWIxNCIsImNyZWF0ZWQiOjE2OTkzNTk2ODYwMzEsImV4aXN0aW5nIjp0cnVlfQ==; _gcl_au=1.1.942175271.1734510362; _QPWSDCXHZQA=f09c224f-e535-4c7b-b1d0-a3bb2f00d07f; REC7iLP4Q=0b28b022-8658-4cf1-bd01-c3e800138a7b; SPC_F=WiArPmadmrHoNrlMPCDGSLr4w28edaUW; REC_T_ID=b7b5c2a8-bd19-11ef-9ddb-5a817ce0f560; _fbp=fb.1.1734510363131.219163448773933893; SPC_CLIENTID=V2lBclBtYWRtckhvtppxchgjhbalxhid; __LOCALE__null=VN; csrftoken=olivyfcSErJyhS3DDW7EsdxEEm3Bhtpx; _gcl_gs=2.1.k1$i1738636036$u214149717; _sapid=bd52b6fe2fb8309b46f23e967743d96c7008f75a1af1d0745b5347ec; SPC_SI=TKuQZwAAAABUOWJ6SEpMSk6RQgAAAAAASWZCRks0VWw=; SPC_SEC_SI=v1-YThrQk1FZTFEYnRQZXlibgaMG6XHkd2zseHOn6JppM7Gh15hsXSD0V2C2DNv6tJv08P6oX8RlP9AttJP0fYLHVMgqUscsUC9kBksvU6FlGM=; _gcl_aw=GCL.1738636042.CjwKCAiA74G9BhAEEiwA8kNfpS4c5Lztpg7MayNC2EoLUble0ly7ofvVfbdGsbKVc2afUEWrQ0txbhoCe8YQAvD_BwE; _gid=GA1.2.1238841278.1738636043; _gac_UA-61914164-6=1.1738636043.CjwKCAiA74G9BhAEEiwA8kNfpS4c5Lztpg7MayNC2EoLUble0ly7ofvVfbdGsbKVc2afUEWrQ0txbhoCe8YQAvD_BwE; SPC_SC_SA_TK=; SPC_SC_SA_UD=; SPC_SC_OFFLINE_TOKEN=; SC_SSO=-; SC_SSO_U=-; SPC_SC_SESSION=; _med=affiliates; _ga_3XVGTY3603=GS1.1.1738649335.2.0.1738649335.60.0.0; SPC_EC=.WTdGRWZscFd0azV0ME5Fbj2DTu96MZM53tvjqis4rDLEM8gnNJBFrnXLAeJct2C4ZICyarP8t1/InaiI8lzB0TJcvCg2fmL3H+oa9/v2MAPkeslGtJ/vUAT/YLkB1KO9dBkTrjtT3V042FxkkeoOt/EByhpDSyxwb5LLrGY5ix/dtT6ZWFRQXlsrz0sCY19IoYPOmPaHRCdWlQ2lJ2mNR3k/NQeTrYbri47xDDvvL9Ux0ByOwBej+sxvAdJvGSDp; SPC_ST=.WTdGRWZscFd0azV0ME5Fbj2DTu96MZM53tvjqis4rDLEM8gnNJBFrnXLAeJct2C4ZICyarP8t1/InaiI8lzB0TJcvCg2fmL3H+oa9/v2MAPkeslGtJ/vUAT/YLkB1KO9dBkTrjtT3V042FxkkeoOt/EByhpDSyxwb5LLrGY5ix/dtT6ZWFRQXlsrz0sCY19IoYPOmPaHRCdWlQ2lJ2mNR3k/NQeTrYbri47xDDvvL9Ux0ByOwBej+sxvAdJvGSDp; SPC_U=1038322000; SPC_R_T_ID=SgVqQwnOyyac7tyqf1qpIEddjzAYg3Kp7SF5KQRE51OAbEj7jjIWOM7B7nqnAJDjbFG4A7xm9QfTVcj0Skd9Xvae5oMD8sabnotsoDy6i4FJsEwLJKMJDDHX3LL/0daVWJx0nh5kdfYk53Mfp47XUqwzyAfky/mn7+cOdZEfdPg=; SPC_R_T_IV=ZEtZSDhyNHhzeFN2M0VDSQ==; SPC_T_ID=SgVqQwnOyyac7tyqf1qpIEddjzAYg3Kp7SF5KQRE51OAbEj7jjIWOM7B7nqnAJDjbFG4A7xm9QfTVcj0Skd9Xvae5oMD8sabnotsoDy6i4FJsEwLJKMJDDHX3LL/0daVWJx0nh5kdfYk53Mfp47XUqwzyAfky/mn7+cOdZEfdPg=; SPC_T_IV=ZEtZSDhyNHhzeFN2M0VDSQ==; SPC_IA=1; SPC_CDS_CHAT=ca5f9b68-3094-4da9-8c69-9fc03e7333ca; _hjSession_868286=eyJpZCI6ImJkNzlhOGQyLTYzNGYtNDM1Ni1hNGI2LTYxNTE4MmE4YmUyMyIsImMiOjE3Mzg2NzM4ODkzMzYsInMiOjAsInIiOjAsInNiIjowLCJzciI6MCwic2UiOjAsImZzIjowLCJzcCI6MH0=; AMP_TOKEN=%24NOT_FOUND; AC_CERT_D=U2FsdGVkX1+051IwQN4bAV8ENnhye9ZGirl/xQ7OlQIm2X+PEb1wSsF2+O80n9tx4JHttjK0EdQMPH3lB3TXrpJleYSduJ0keEXXJbvXcG72gmzuZAOm8aTfmB0Gqaab4qNTyd7VK9AhH1njxBUm5zGTvp3qiT2rRthNbxYtIK9Z5i2qbXh6Le/1GRmzM9D55fPEcKJvzp69yrvpt97afo7HwdoBmMN6gGeUNjmQYnHRn7vW4zZaRasj1ZZf8mlW6ZYOJgkJpBKqXjDSGBUNvSAwgdLjgE+W2vtHaPxJihx2BL3xkie1lrDzIQNrJwpvXDI5d8/PslaFcVfX56yprbH3GRJ7Ht+3XrdodCaTo4yN4VUP/I6k4YZ/RAVEW7a4YWjI4enaqIvM/HIBPDTNQIaxfr4wIrK9TNzVGNGqPK+kmclziQ6n2hS+PQju/REKnLZIRgsyNkES1kfF+S/vOG9jwuf/6B1tb4P20YjX8ReFpq3oEbugWK/je3WByDQS2SpAc2Us3bParBIc1jWE5FPCHducu0I55Ji/EhOBOkuM0cely8IdIh9m+aQ54gJPaNr8L6cRbUHULkPhtK2zKV/PTgwerLp6OpcgeNQ48mUWSGfmoOmcNy0cle48jUI7i061ZI/4GYOaTwwd5af/YKCNf6xgnvelCUxazUg3hGcC5UGuLis3xoIj1oaY3JNlZ2EJTfzLBpiBBmIF9vfyz09528SpEfSvgH0o5hHgdy3kBbEnXjmROcdMXvtN/lg6292AQC+wxcresHC4lU1OlOSqrO0V13kINEhD4Kdj0TvRiH4foWMluQ8nrQMEaeFBs3oSG9JusBz00ZYTE2dkxZMo/NE2qVPQ0T2Rm4RAJbPqJzsCzDZ917HNMpGKf6JaR2c2PRvYMonFNekoKW7ovDQsI20rNOhrvvnr1K3GBY8fGsjM7XjaxBqRctWcL4/Nd3RPiDdE1fzBBFBXznBw5kM+UTvJmxpjZWiTCeHBRwb/FY8mO8HXBxQRRT7uPNLzpM9Xhsz/xiIyvYoA/AzeJVwchFkuwXzSyMgfS94iUJ5/Y8uYjKKn7GOCFpZti5pwRsvEZaN/e4u9x6oTTPNeVKnZenHXcbzspLoD1QScom4=; _ga_4GPP1ZXG63=GS1.1.1738673890.8.1.1738676808.1.0.0; _ga=GA1.1.1485582466.1734510365; shopee_webUnique_ccd=hvMh8%2FCiHmXiNzj%2FoXqWiw%3D%3D%7CU2Wc0eekSCZ08f3oN3N1lIFv82BqnkWodcLcuRzGYluHJOD6Tux%2BiIODWIai1nKOkGFhDF98p007ivBm2SY%3D%7CAd72eAwBpUukwYAo%7C08%7C3; ds=f36299a1c657428b68b82f32f5fe14aa
d-nonptcha-sync:
AAAGyiheFr0AAA4AACrwvlbQ1/y8Y4UD3gD1AAANxQbEAMwAABVCBsgAxQAAFU0GygDAAAAVUAbOALoAABVZBs8AtgAAFXMGzwC1AAAVgwbPALMAABWPBqoAwQAAGJ8DlAFcAAAYoAOUAWAAABlvA5QBYQAAGXADlgFjAAAZeAOYAWUAABwk
if-none-match-:
55b03-6484cfe141201e7c2a326b78d2f0129d
priority:
u=1, i
sec-ch-ua:
"Not A(Brand";v="8", "Chromium";v="132", "Microsoft Edge";v="132"
sec-ch-ua-mobile:
?0
sec-ch-ua-platform:
"Windows"
sec-fetch-dest:
empty
sec-fetch-mode:
cors
sec-fetch-site:
same-origin
user-agent:
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36 Edg/132.0.0.0
x-api-source:
pc
x-requested-with:
XMLHttpRequest
x-sap-ri:
141ca267c47e1d98ca24fe3d050133a7b9bcfcbcf038dc66b49a
x-sap-sec:
B2L3GDUvlI/lCEuEGI2EGErEEI2BGI5E8I0yGepEUlLiGs2EfIL9G5XERI2dGPXEQI2DG4AE2DLXGO2EWlLNGrrENI04Ge5EcI2hGspEmILvG42ElI0OGsjETIL+G4XE6IL6Gh2EvIKOGSVEYl0WGIwE2I0zGOpEzI2KGrbECDLsGEuE2QLEGr2EyILuGeuEZI0QGkwEKD2EGIKRY1BOGI2EGI2ExW0FMI6YfshqGILoaLueGI02/zWRzvZfN5VdGz6EG5qlGe215ZWS2OJqMDKeuRvjccwsGILDGQ2EGI2U9VuHGI2EGI22SbdXBTpHGI2EGsuQYIREGI2EGJjEGE2jjIREGIpHGI2EGsusG5UJBqwHGI0kvdrpgLmkYJEheBIIGl2EGI2ELFvAGEAIGl2E+/BjG1SNPazEGIKP0IREGILiG/xNyBvMmI6EGo3lLRwEGkEHpINEGS2SGI2EGkFw2DGk6HXEx7b4GQ2EajMnGAecmpqr+/fMfsUCSZynJUaPbqeMrNw2K15JvX9IDyaCbg6Y9XtT+altqXAzxz31o41H0bydNIgNFqddvubfGmMWjyMlZMxb++G+dmbFiap1MMKtm1glHOugG6kRXsbOSm9rMEdhIam0SDCJ3cwOhws4X8K5SiVzyX7Jib6geepNfbMzjxE1wfDR1oSgNEkHf9BuAqEH3DSmNMNhq01bBGwNoQRasMcmIIJ0W7dLWI1/Xf9tKyu182kW1GVOjizuPbuF0GI/iPn4NwITPApVC+9VfFbp8V2BstUWjaU0/evGTJYEHnycxJ1TM5TKaK2mg4lcjILXoIEBeKZntCLwgNZoueerB7zEGIpEGI2+IicmwI2EGJ5kDmb1gaSkWl6EGhJH2n1ALGJ0IhuNRrAzmmjBr28VO4E8llDxfr6Pc8CStFL73Ozr6uaxY11UDVG1pI8O6cS/kNZZ7F+9dYN3BiTVGZmds27oSUiY99sVCgC2FZn27a/OgYS7zlnNGUDX9wF+fzfnNapnN5o9GqJBy8Clp4YhmmYQceJlgvVEVaSI/s/PIzYu5s1+nwacMTZcsrfw3cKvHf6lBypKvA+AIlYotWv1iRnjmRBB1AvkIQRGFA5XYcV/fxMvXG0WaHbsa0aX80fz2lM0C30yPG0rF4W/VsLTmJXusbHrJIP9oI9qPfM3CbqW9/KcpSSv5nqgX8BiNZsN4l7WI4mcZ36wrLq8GTelutETtdaFWOfOnAHUtfQj/5BHcPh1SAY5jE6X8JEQWqZVz9QNq/J69lZVp8NiFAqDe3OxSpFiN3XYugLup8sj2qTG11M0OYUu3WsOYZBFOZhCuoaEJ/uhnLIVQdZzrlbUSEHUGIpEGILE2dH6GD2EGhsQGI2SGI2EHKzEGIpEGIK94Z3+GI2EGIHEGIKu5sg91I2EGI5EGIKL4xZN8hgIGPwEGIKHHSLwuvv6E0n1LU5V06BaIuc5egUsHGEx4Zs61/sRsoJYMEa9S3QGP0EpezDLpataBt8yzZs7dsOj/39WHKCQcaIp0NnaoncaQUJIUeGn+S8YMCY57sgGGI2EGI2EGI2EGI2EfI2EGo/wEnjmpCM9+weHo98EoavVMngdzsnIc6hvSZiT6Cm8OSI0pQ2EGI2RGI2E8dTMQcNZMSi0G2VC4lhMFJ4HC697O0jprMK2GI2EGI2IGI2ELUOu5lF85ZuHGI2Ek2LeGs==
x-shopee-language:
vi
x-sz-sdk-version:
1.12.15"""

URL = "https://shopee.vn/api/v4/search/search_filter_config?match_id=11036132&page_type=search&scenario=PAGE_CATEGORY"
FILENAME = "search_filter.json"
header_request_raw_arr = header_request_raw.split("\n")
header_json = {}
for i in range(0, len(header_request_raw_arr)):
     if (i % 2 != 0):
          continue
     header_json[header_request_raw_arr[i][:-1]] = header_request_raw_arr[i + 1]

# print (header_json)
     

response = requests.get(URL, headers=header_json);
data = json.loads(response.content)
with open(FILENAME, "a") as f:
     f.write(json.dumps(data));