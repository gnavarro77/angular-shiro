angular.module('templates-toto', ['../toto.html']);

angular.module("../toto.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../toto.html",
    "{\n" +
    "  \"info\": {\n" +
    "    \"authc\": {\n" +
    "      \"principal\": \"edegas\",\n" +
    "      \"credentials\": {\n" +
    "        \"name\": \"Edgar Degas\",\n" +
    "        \"login\": \"edegas\",\n" +
    "        \"email\": \"edegas@mail.com\"\n" +
    "      }\n" +
    "    },\n" +
    "    \"authz\": {\n" +
    "        \"roles\" : [\"ADMIN\"],\n" +
    "        \"permissions\" : [\"address:view,create,edit,delete\"]\n" +
    "    }\n" +
    "  }\n" +
    "}");
}]);
