Swagger in ASP.Net Core: https://docs.microsoft.com/en-us/aspnet/core/tutorials/web-api-help-pages-using-swagger
Authentication: http://asp.net-hacker.rocks/2016/09/22/web-api-authentication-in-aspnetcore-and-angular2.html

Shibboleth Auth Ideen
* Endpunkte die Auth. benötigen in shibboleth's xml file konfigurieren
* Wenn Player einen geschützten Endpunkt anspricht und vom Server eine Response ohne 
  Shibboleth header bekommt, dann zeigt der Player in einem iFrame eine Webresource an,
  die ebenfalls Shibboleth geschützt ist, so dass Shibboleth dann seine login seite anzeigt.
  Nach der Auth. in diesem iFrame sollten alle weiteren REST requests dann erfolgreich mit
  Shibboleth headern versehen sein.