# Pruebas Unitarias en Angular

En Angular, tenemos 2 herramientas para realizar Unit Tests, por un lado, tenemos a [Jasmine](https://jasmine.github.io/) que es un framework para hacer pruebas. Según su documentación oficial:

> Jasmine is a behavior-driven development framework for testing JavaScript code. It does not depend on any other JavaScript frameworks. It does not require a DOM. And it has a clean, obvious syntax so that you can easily write tests.

Por el otro, tenemos [Karma](https://www.notion.so/Servicios-60730fd290b04fcd806c5eede7d0e972), que es un test runner (ejecuta las pruebas), que según su sitio oficial, describen el principal objetivo de esta herramienta cómo:

> Bring a productive testing environment to developers. The environment being one where they don't have to set up loads of configurations, but rather a place where developers can just write the code and get instant feedback from their tests. Because getting quick feedback is what makes you productive and [creative](http://vimeo.com/36579366).

En sí, Karma corre por detrás, por lo cuál, solo deberíamos enfocarnos en Jasmine, qué es donde escribiremos las pruebas.

## Jasmine vs. Jest: entornos para testing

Si bien, actualmente el framework de pruebas más famoso es Jest, algo que debemos tener en cuenta es que los proyectos de Angular ya vienen pre-configurados con Jasmine, por lo que no tenemos que preocuparnos por nada.

Angular ya nos provee una plataforma para ejecutar nuestras pruebas, donde con solo ejecutar algunos comandos, podemos realizar muchas acciones.

Algo importante a tener en cuenta de los frameworks de testing en JS, es que prácticamente todos manejan la misma estructura, a diferencia de lo que pasa en el mundo del frontend donde tanto el código, cómo la estructura de un proyecto en cada tecnología puede variar en gran medida.

A continuación, se muestra una prueba para cada una de estas tecnologías:

- **Jest**

    ```jsx
    describe("A suite is just a function", () => {
      const a;
      test("and so is a spec", () => {
        a = true; expect (a).toBe(true);
      });
    });
    ```

- **Jasmine**

    ```jsx
    describe("A suite is just a function", () => {
      const a;
      it("and so is a spec", () => {
        a = true; expect (a).toBe(true);
      });
    });
    ```

Como habrás notado, la única gran diferencia es que Jasmine utiliza la palabra reservada `it`, mientras que Jest utiliza `test`. Pero no solo Jasmine usa esta palabra reservada, sino otros frameworks como Mocka, chai, etc.

Esto último es tan común, que Jest permite utilizar cualquiera de estas palabras reservadas (`test` o `it`) para correr una prueba. Por lo tanto, sin importar el framework que elijas, la estructura de los test no va a variar.

### Test match

En las pruebas, se tiene algo llamado “test matchers”, que prácticamente son funciones que nos permiten hacer comprobaciones. A continuación, se muestran algunos ejemplos de matchers de Jest y Jasmine.

- **Jest**

    ```jsx
    test('null', () {
      const n = null;
      expect(n).toBeNull();
      expect(n).toBeDefined();
      expect(n).not.toBeUndefined();
      expect(n).not.toBeTruthy();
      expect(n).toBeFalsy();
    });
    ```

- **Jasmine**

    ```jsx
    it('null', () {
      const n = null;
      expect(n).toBeNull();
      expect(n).toBeDefined();
      expect(n).not.toBeUndefined();
      expect(n).not.toBeTruthy();
      expect(n).toBeFalsy();
    });
    ```

Como pudiste observar, los matchers de Jest y Jasmine son exactamente iguales. Dicho esto, te darás cuenta que la herramienta que decidas usar, al final, no será un problema, ya que los test se escriben de igual manera.

## Proyecto

Si creas un proyecto desde la CLI de Angular, te darás cuenta que en la raíz se encuentra un archivo llamado **karma.config.js**, el cuál contiene la configuración del test runner.

Si abres dicho archivo, verás una serie de plugins definidos, entre ellos, uno que se llama **karma-chrome-launcer**, esto se debe a que nuestras aplicaciones se ejecutan en un navegador y Karma utiliza el motor de Chrome para ejecutar las pruebas.

>💡 Cabe mencionar, que es acá dónde podrías cambiar Chrome por cualquier otro motor de tu preferencia.

Karma, de manera automática leerá todos los archivos que terminen en **.spec.ts**, ya que es en esos archivos donde normalmente se definen las pruebas.

>💡 Se usa el sufijo **spec** porque en estos archivos se definen las especificaciones (o los contratos) que nuestro componente debe cumplir para funcionar correctamente.

### Tests en WSL

Ten en cuenta que para ejecutar estos test en WSL, tendrás que realizar la siguiente configuración:

```bash
sudo apt update && sudo apt -y upgrade && sudo apt -y autoremove

wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb

sudo apt -y install ./google-chrome-stable_current_amd64.deb

google-chrome --version
```

## Secciones

[Componentes](https://www.notion.so/Componentes-8104576004504fd4a1e95711c08a5a92)

[Servicios](https://www.notion.so/Servicios-60730fd290b04fcd806c5eede7d0e972)
