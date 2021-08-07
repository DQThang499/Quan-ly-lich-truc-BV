# appgw

"gateway" là một ứng dụng web là một phần của kiến trúc microservice.

## Development

Before you can build this project, you must install and configure the following dependencies on your machine:

1. [Node.js][]: We use Node to run a development web server and build the project.
   Depending on your system, you can install Node either from source or as a pre-packaged bundle.
2. [Yarn][]: We use Yarn to manage Node dependencies.
   Depending on your system, you can install Yarn either from source or as a pre-packaged bundle.

After installing Node, you should be able to run the following command to install development tools.
You will only need to run this command when dependencies change in [package.json](package.json).

    yarn install

We use yarn scripts and [Webpack][] as our build system.

Run the following commands in two separate terminals to create a blissful development experience where your browser
auto-refreshes when files change on your hard drive.

    ./mvnw
    yarn start

[Yarn][] is also used to manage CSS and JavaScript dependencies used in this application. You can upgrade dependencies by
specifying a newer version in [package.json](package.json). You can also run `yarn update` and `yarn install` to manage dependencies.
Add the `help` flag on any command to see how you can use it. For example, `yarn help update`.

The `yarn run` command will list all of the scripts available to run for this project.

### Service workers

Service workers are commented by default, to enable them please uncomment the following code.

* The service worker registering script in index.html

```html
<script>
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
        .register('./service-worker.js')
        .then(function() { console.log('Service Worker Registered'); });
    }
</script>
```

Note: workbox creates the respective service worker and dynamically generate the `service-worker.js`

### Managing dependencies

For example, to add [Leaflet][] library as a runtime dependency of your application, you would run following command:

    yarn add --exact leaflet

To benefit from TypeScript type definitions from [DefinitelyTyped][] repository in development, you would run following command:

    yarn add --dev --exact @types/leaflet

Then you would import the JS and CSS files specified in library's installation instructions so that [Webpack][] knows about them:
Note: there are still few other things remaining to do for Leaflet that we won't detail here.

For further instructions on how to develop with JHipster, have a look at [Using JHipster in development][].



## Building for production

To optimize the appgw application for production, run:

    ./mvnw -Pprod clean package

This will concatenate and minify the client CSS and JavaScript files. It will also modify `index.html` so it references these new files.
To ensure everything worked, run:

    java -jar target/*.war

Then navigate to [http://localhost:8080](http://localhost:8080) in your browser.

Refer to [Using JHipster in production][] for more details.

## Testing

To launch your application's tests, run:

    ./mvnw clean test

### Client tests

Unit tests are run by [Jest][] and written with [Jasmine][]. They're located in [src/test/javascript/](src/test/javascript/) and can be run with:

    yarn test

UI end-to-end tests are powered by [Protractor][], which is built on top of WebDriverJS. They're located in [src/test/javascript/e2e](src/test/javascript/e2e)
and can be run by starting Spring Boot in one terminal (`./mvnw spring-boot:run`) and running the tests (`yarn run e2e`) in a second one.
### Other tests

Performance tests are run by [Gatling][] and written in Scala. They're located in [src/test/gatling](src/test/gatling).

To use those tests, you must install Gatling from [https://gatling.io/](https://gatling.io/).

For more information, refer to the [Running tests page][].

## Using Docker to simplify development (optional)

You can use Docker to improve your JHipster development experience. A number of docker-compose configuration are available in the [src/main/docker](src/main/docker) folder to launch required third party services.

For example, to start a mysql database in a docker container, run:

    docker-compose -f src/main/docker/mysql.yml up -d

To stop it and remove the container, run:

    docker-compose -f src/main/docker/mysql.yml down

You can also fully dockerize your application and all the services that it depends on.
To achieve this, first build a docker image of your app by running:

    ./mvnw verify -Pprod dockerfile:build dockerfile:tag@version dockerfile:tag@commit

Then run:

    docker-compose -f src/main/docker/app.yml up -d

For more information refer to [Using Docker and Docker-Compose][], this page also contains information on the docker-compose sub-generator (`jhipster docker-compose`), which is able to generate docker configurations for one or several JHipster applications.

## Continuous Integration (optional)

To configure CI for your project, run the ci-cd sub-generator (`jhipster ci-cd`), this will let you generate configuration files for a number of Continuous Integration systems. Consult the [Setting up Continuous Integration][] page for more information.

# Tổng quan về React

## I.Khái niệm

<li> React (còn được gọi là Reactjs hay React.js) là một Thư viện javascript được tạo ra bởi sự cộng tác giữa Facebook và Instagram. 
Nó cho phép những nhà phát triển web tạo ra giao diện người dung nhanh chóng. 
Phần Views của Reactjs thường được hiển thị bằng việc chủ yếu dung các component mà chứa các component cụ thể hoặc các thẻ HTML.
Một trong những đặc trưng duy nhất của Reactjs là việc render dữ liệu không những có thể thực hiện ở tầng server mà còn ở tầng client.

## II.Ưu điểm

### a) Virtual DOM

Virtual DOM tạo ra bản cache cấu trúc dữ liệu của ứng dụng trên bộ nhớ.
Sau đó, ở mỗi vòng lặp, nó liệt kê những thay đổi và sau đó là cập nhật lại sự thay đổi trên DOM của trình duyệt một cách hiệu quả.
Điều này cho phép ta viết các đoạn code như thể toàn bộ trang được render lại dù thực tế là Reactjs chỉ render những component hay subcomponent nào thực sự thay đổi.

![alt text](..\document\picture\virtual-DOM.png)

### b) JSX

<li> Reactjs giúp việc viết các đoạn code JS dễ dàng hơn: Nó dung cú pháp đặc biệt là JSX (Javascript mở rộng) cho phép ta trộn giữa code HTML và Javascript.
Ta có thể them vào các đoạn HTML vào trong hàm render mà không cần phải nối chuỗi.
Nó sẽ chuyển đổi các đoạn HTML thành các hàm khởi tạo đối tượng HTML bằng bộ biến đổi JSX.

### c) Có rất nhiều tài liệu và sự hỗ trợ từ cộng đồng

## III. DATA FLOW CỦA REACT VÀ REDUX

### a) Component
<li>Tất cả các thành phần trong 1 trang web đều được hiểu là component.
Với sự trợ giúp của virtual DOM, các component đều được khởi tạo dưới dạng Javascript Object và được truyển đồi thành HTML DOM mỗi khi được render.

### b) State vào props
<li>Dữ liệu trong React tất cả đều được quy về 2 loại, đó là state và props.
State là trạng thái của 1 component, nó có thể được khởi tạo bên trong component hoặc được truyền từ component cha.
State có thể được thay đổi bên trong component.

![alt text](..\document\picture\state.png)

<li>Props là các thuộc tính của 1 component, được truyền từ component cha.
Khác với state, props không thể bị thay đổi bởi component sử dụng nó.

![alt text](..\document\picture\props.png)

### c) Event data flow

Dữ liệu trong React sẽ chỉ được truyền theo 1 chiều duy nhất, đó là từ component cha đến component con thông qua props.
Không có chiều ngược lại. Nhưng có thể truyền một sự kiện để thay đổi thông tin từ node cha, từ đó thay đổi props và hiện thị ở node con.

![alt text](..\document\picture\event.png)
![alt text](..\document\picture\total.png)

### d) Redux

Với việc không sử dụng Redux, các component sẽ giao tiếp với nhau bằng props. 
Nếu chúng ta cần lấy state của một component cách nhau 3 tầng, chúng ta phải gọi 3 lần, điều đó sẽ khiến việc code và quản lý state rất phức tạp, và to dần lên theo thời gian.
Với việc sử dụng Redux, chúng ta sẽ lưu state của các component vào 1 store chung ở bên ngoài. 
Sau đó nếu muốn dùng ở component nào chúng ta chỉ cần gọi nó và sử dụng.

![alt text](..\document\picture\redux.png)
![alt text](..\document\picture\redux.jpg)

## IV.	GIAO DIỆN ĐỘNG THEO NGƯỜI DÙNG

React có một số công cụ để thực hiện kéo thả các phần của giao diện, quản lý giao diện như [react-grid-layout](https://strml.github.io/react-grid-layout/examples/0-showcase.html).
Từ đó có thể đáp ứng tốt nhiều yêu cầu riêng biệt của nhiều đơn vị khách hàng.

![alt text](..\document\picture\react-grid-layout.png)

# Tổng kết

<li> Việc sự dụng React rất thích hợp trong các dự án lớn vì quản lý hiệu quả quá trình cập nhật giao diện, thống nhất về dữ liệu, tăng hiệu năng của ứng dụng hạn chế sai sót trong trình lập trình.
     Dễ dàng phát triển thành ứng dụng đa nền tảng từ Window application cho tới mobile application (Android, IOS) bằng React Native.

# Một số lỗi thường gặp

## Tắt báo lỗi của tslint
    /* tslint:disable:rule1 rule2 ...*/
       {
            code block
       }
    /* tslint:enable:rule1 rule2 rule3... */
#### object-literal-shorthand:
Gán giá trị cho property khi property có tên match với tên của biến:
Từ:

    { a: a, b: b}
Thành
 
    { a, b }


[JHipster Homepage and latest documentation]: https://www.jhipster.tech
[JHipster 5.0.2 archive]: https://www.jhipster.tech/documentation-archive/v5.0.2
[Doing microservices with JHipster]: https://www.jhipster.tech/documentation-archive/v5.0.2/microservices-architecture/
[Using JHipster in development]: https://www.jhipster.tech/documentation-archive/v5.0.2/development/
[Service Discovery and Configuration with the JHipster-Registry]: https://www.jhipster.tech/documentation-archive/v5.0.2/microservices-architecture/#jhipster-registry
[Using Docker and Docker-Compose]: https://www.jhipster.tech/documentation-archive/v5.0.2/docker-compose
[Using JHipster in production]: https://www.jhipster.tech/documentation-archive/v5.0.2/production/
[Running tests page]: https://www.jhipster.tech/documentation-archive/v5.0.2/running-tests/
[Setting up Continuous Integration]: https://www.jhipster.tech/documentation-archive/v5.0.2/setting-up-ci/

[Gatling]: http://gatling.io/
[Node.js]: https://nodejs.org/
[Yarn]: https://yarnpkg.org/
[Webpack]: https://webpack.github.io/
[Angular CLI]: https://cli.angular.io/
[BrowserSync]: http://www.browsersync.io/
[Jest]: https://facebook.github.io/jest/
[Jasmine]: http://jasmine.github.io/2.0/introduction.html
[Protractor]: https://angular.github.io/protractor/
[Leaflet]: http://leafletjs.com/
[DefinitelyTyped]: http://definitelytyped.org/
