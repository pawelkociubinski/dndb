## Setup:

- npm install
- npm run knex:migrate:latest
- npm run develop


Czy kod jest skomplikowany? Tak. Czy dało się prościej? Oczwywiście :D 
Jednakże skomplikowanie nie wynika z "bałaganu" czy też "niechlujstwa" w pisaniu. 
Narzut ten wynika tylko i wyłącznie z przyjętej architektury, który jest dość wysokim (i stromym) klifem dodatkowej wymaganej wiedzy, aby moc swobodnie poruszać w obrębie tego rodzaju kodu. Równocześnie zaznaczam, że DDD i architektura hexagonalna to dziura bez dna. Mój kod korzysta z pewnych wzorców, ale nie jest jego idealnym odwzorowaniem.

Ostatecznie, zdaję sobie sprawę, że strzelam do muchy z armaty, przyjmując takowy styl pisania kodu. Podejmując to ryzyko chciałbym pokazać pewien wycinek moich umiejętności. Najlepsza optymalizacja (jak i słuszne decyzje projektowe :D) nie były głównym celem podczas pisania tego projektu! 

Motywacją do podjęcia takiej decyzji wobec stylu jest fakt, ze gry, a dokładniej świat przedstawiony w grach, BARDZO dobrze mapuje się na architekturę domenową. 
Jest bardzo łatwo wyznaczyć zakresy/granice model. Człowiek intuicyjnie wyczuwa "co przynależy do czego" i nie trzeba operować pojęciach, które bez znajomości kontekstu nic o sobie nie mówią (np. WorkerFactoryProvider etc.). Po prostu jest bohater, wielki topór i przeciwnik na jego końcu.

Fun cact: e-commerce również ładnie się mapuje do architektury domenowej. 


## Rzeczy do poprawy lub do dopisania:

Event Bus - agregaty powinny rozmawiać ze sobą za pomocą eventów
lepszy error handling oraz logowanie
no i więcej testów;)

## Przyjęte reguły projektowe:

### Knex oraz SQLite
Używam Query Builder, ponieważ daje mi więcej możliwości ekspresji + lepsze bezpieczeństwo typów oraz po prostu czuje wewnętrzny dyskomfort, mieszając obcy DSL z innym DSL.

Uzywam SQLite poniewaz nie wymaga osobnego setupu. Polecam również ten [extension](https://marketplace.visualstudio.com/items?itemName=qwtel.sqlite-viewer) aby móc swobodnie przeglądać pliki *.sqlite lokalnie.

### Agregaty, encje, object values oraz zdarzenia domenowe
Agregat MUSI być wewnętrznie spójny! To oznacza, że jest on jedynym "entry point" dla wewnętrznych encji i object values.
Enkapsuluje w swoim zakresie wszystkie niezmienniki i wymagania biznesowe.
Upublicznione są tylko te metody, które są zgodne z wymaganiami biznesowymi. 
Należy unikać publikowania metod pomocniczych w agregacie tylko dla developmentu!
Agregat podczas cyklu swojego życia powinien emitować eventy. Koncepcja agregatu bardzo dobrze wpisuje się w architekturę sterowaną zdarzeniami oraz najlepiej współgra z bazami danych typu NoSQL. (Agregat to naturalny kandydat na dokument)

### Encje:
Encja która zawiera w sobie inne encje zazwyczaj jest agregatem.
Encja i agregat współdzielą ze sobą wiele podpobieństw ale są różnice:
    - Agregat "zamyka" inne encje w sobie i tylko on ma ekskluzywne prawo do zarządzania ich cyklem życia.
    - O ile cyklem życia agregatu zarządza repozytorium to cyklem życia encji zarządza agregat.

### Repozytoria:
Repozytoria są odpowiedzialne za zarządzanie cyklem życia agregatów.
Koncept "czasu" lub tez "cyklu życia" obiektów w DDD jest bardzo istotny
Odczyt agregatu, stworzenie agregatu, modyfikacja agregatu, to wszystko musi być wykonywane przez warstwę repozytorium, który ma ekskluzywne prawo do zarządzania agregatem. 


### Słowniczek:
- **Cykl życia** można rozumieć jako moment tworzenia, modyfikacji i usuwania obiektu w czasie trwania programu. 

- **agregat** oraz **encja** są obiektami okołorzeczownikowymi, najczęściej są to rzeczy świata rzeczywistego, który wewnątrz siebie zawierają cechy ją tworzące jak na przykładzie obiektu miecz mamy: kolor, nazwa, statystyki, stan techniczny (sprawny/uszkodzony). Upublicznia on (agregat lub encja) jedynie te metody biznesowe, które ktoś w świecie rzeczywistym mógłby na tym obiekcie wykonać, jak np. "naostrz", "zatruj", "wyczyść" etc. Agregaty i encje są strażnikami reguł biznesowych.

**Serwis Aplikacji** broni integralności danych, aby agregat nie musiał tego robić. Przykład: Serwis Aplikacji sprawdza, czy przedmiot w ogóle istnieje, a agregat Charakter dopiero broni reguł biznesowych, np. czy przedmiot może być używany przez wybraną klasę postaci. 
Serwis Aplikacji koordynuje pracę wielu agregatów. 
