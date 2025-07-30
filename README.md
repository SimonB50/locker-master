# Locker Master
Aplikacja do zarządzania szafkami szkolnymi oraz przypisanych do nich uczniami.

## Wymagania
W celu uruchomienia aplikacji, należy zainstalować [Node.js](https://nodejs.org/en/download).

## Instalacja
1. Sklonuj repozytorium: `git clone`
2. Przejdź do katalogu projektu: `cd locker-master`
3. Zmień nazwę pliku `.env.example` na `.env` i dostosuj ustawienia do swoich potrzeb.
   - Zaleca się zmianę domyślnego hasła do logowania do aplikacji.
   - Można to zrobić poprzez zmianę wartości `PASSWORD`.
4. Zainstaluj zależności: `npm install`
5. Zbuduj aplikację: `npm run build`
6. Uruchom aplikację: `npm run start`
7. Otwórz przeglądarkę i przejdź do `http://localhost:3000`

## Aktualizacja
Aby zaktualizować aplikację do najnowszej wersji, wykonaj następujące kroki:
1. Pobierz najnowsze zmiany z repozytorium: `git pull`
2. Zainstaluj nowe zależności: `npm install`
3. Zbuduj aplikację ponownie: `npm run build`
4. Uruchom aplikację ponownie: `npm run start`

## Domyślne hasło
Domyślne hasło do logowania aplikacji to `N@szaSzkola`.<br>
Zaleca się zmianę domyślnego hasła poprzez modyfikację pliku `.env` w głównym katalogu projektu.

## Użyte technologie
- [TypeScript](https://www.typescriptlang.org/)
- [Node.js](https://nodejs.org/)
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [daisyUI](https://daisyui.com/)
- [Prisma ORM](https://www.prisma.io/orm/)

## Wsparcie
Jeżeli masz pytania, potrzebujesz pomocy lub chcesz zaimplementować system w swojej szkole, skontaktuj się ze mną poprzez e-mail: <a href="mailto:szymon.dawid@gmail.com">szymon.dawid@gmail.com</a>.<br>
Sugestie bądź błędy można również zgłaszać za pośrednictwem [GitHub Issues](https://github.com/SimonB50/locker-master/issues).