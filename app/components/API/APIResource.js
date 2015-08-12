angular.module("portfolio.api", [
    "ngResource"
])

.factory("APIResource", [
    "$resource",
    "env",
    function ($resource, env) {
        return $resource(
            env.API_ADDRESS,
            {},
            {
                getAbout:{
                    method: "GET",
                    url: env.API_ADDRESS + "article"
                }
            }
        );
    }
]);
