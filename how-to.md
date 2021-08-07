## Ready for release

Gitflow for every release

1. Tạo nhánh release mới.
        git flow release start 1.1.5 <-- Tạo release mới với tag là 1.1.5
1. Bump version. Hoặc các fix sau cùng.
        Thay đổi trong file pom.xml
        git add pom.xml
        git commit -m "Bump version"
1. Build thử project.
        Xem bên dưới.
1. Finish release.
        git flow release finish 1.1.5
1. Push
        git push (dev)
        git push (master)
        git push --tags <-- push luôn cái tag mới 1.1.5

## Production packaging

Thường khi build/package ra fat jar, ta cần clean, sau đó build/package và cuối cùng là deploy (upload file jar lên repo của cty).

### Clean

        mvn clean

### Build/package

        mvn verify

### Deploy

        mvn deploy

Để chèn profile vào, dùng option `-P`. VD: `mvn -Pprod verify` sẽ thực hiện package ra file jar và file jar này sẽ ưu tiên chạy theo profile prod khi được thực thi.

**Đối với dự án hiện tại:**

Chạy

        mvn clean && mvn -Pprod verify && mvn deploy

Câu lệnh tương tự (chưa test)

        mvn -Pprod clean verify deploy

## Sau khi build ra được file jar, run thử ở local:

    java -Dspring.profiles.active=prod,no-liquibase -jar path-to.jar

Nếu ok hết thì sẵn sàng để release

## Lưu ý:

Để có thể upload được lên repo công ty, cần cấu hình thêm trong file config của maven:

```xml
~/.m2/wrapper/dists/apache-maven-3.5.0-bin/6ps54u5pnnbbpr6ds9rppcc7iv/apache-maven-3.5.0/conf/settings.xml
Hoặc
/opt/maven/conf/settings.xml

<servers>
<server>
    <id>IT.eHEALTH.Maven.MS-Hosted-snapshots</id>
    <username>auto.ehealth.pm3</username>
    <password>XXX</password>
<server>
<server>
    <id>IT.eHEALTH.Maven.MS-Hosted</id>
    <username>auto.ehealth.pm3</username>
    <password>XXX</password>
<server>

</servers>
```
