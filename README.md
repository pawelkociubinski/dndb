
## Setup:

The only things required to run the project are NPM and Node.js.

In the system console:
- npm install
- npm run knex:migrate:latest
- npm run develop

at this point, the Apollo Sandbox website should open up

## ENG
"Is the code complicated? Yes. Could it have been simpler? Of course! :D
However, the complexity isn't due to "messiness" or "sloppiness" in writing. Instead, the overhead arises from the architecture chosen, which presents quite a steep learning curve. At the same time, I want to emphasize that DDD (Domain-Driven Design) and hexagonal architecture are ongoing learning processes. My code uses certain patterns, but it is not their perfect reflection.

I acknowledge that my approach might seem like using a cannon to kill a fly. I took this risk to showcase a snippet of my skills. Optimal performance and perfect design decisions weren't the primary objectives when crafting this project! :D

The rationale for my stylistic choices is that project, especially the worlds depicted in them, align very well with domain architecture. It's straightforward to delineate scopes and boundaries within the model. People can intuitively grasp "what belongs to what" without resorting to jargon that, without context, is meaningless (e.g., WorkerFactoryProvider, etc.). In this world, there's simply a hero, a large axe, and an adversary on the receiving end.

### Things to improve or add:
- Logging
- more tests ;)

## Adopted design rules:
### Knex and SQLite
I use a Query Builder because it gives me more expression possibilities + better type safety and I simply feel internal discomfort mixing one DSL with another.
I use SQLite because it doesn't require separate setup. I also recommend this [extension](https://marketplace.visualstudio.com/items?itemName=qwtel.sqlite-viewer) to freely preview *.sqlite files locally.

### Aggregates, entities, object values, and domain events
An aggregate MUST be internally consistent! This means it's the only "entry point" for internal entities and object values.
It encapsulates all invariants and business requirements.
Only those methods that comply with business requirements are made public.
Avoid exposing helper methods in the aggregate just for development purposes!
An aggregate should emit events during its lifecycle. The aggregate concept fits very well into event-driven architecture and works best with NoSQL databases. (An aggregate is a natural candidate for a document)

### Entities:
An entity that contains other entities is usually an aggregate.
Entities and aggregates share many similarities, but there are differences:
- An aggregate "encloses" other entities and is the only one with the exclusive right to manage their lifecycle.
- While an aggregate's lifecycle is managed by a repository, an entity's lifecycle is managed by the aggregate.

### Repositories:
Repositories are responsible for managing the lifecycle of aggregates.
The concept of "time" or "lifecycle" of objects in DDD is very significant.
Reading an aggregate, creating an aggregate, modifying an aggregate, all must be done by the repository layer, which has the exclusive right to manage the aggregate.

### Glossary:
Lifecycle can be understood as the moment of creation, modification, and deletion of an object during the program's duration.

**aggregate** and **entity** are noun-like objects, often real-world things, containing features like the sword object: color, name, statistics, technical condition (functional/damaged). It (aggregate or entity) only exposes those business methods that someone in the real world could perform on it, like "sharpen," "poison," "clean," etc. Aggregates and entities are guardians of business rules.

Application Service defends data integrity, so the aggregate doesn't have to. For example: The Application Service checks if the item even exists, and the Character aggregate only defends business rules, e.g., if the item can be used by a chosen character class. The Application Service coordinates the work of multiple aggregates.

## PL
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
