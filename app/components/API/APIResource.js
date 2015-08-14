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
                },
                getProjects:{
                    method: "GET",
                    url: env.API_ADDRESS + "projects"
                },
                getExperiences:{
                    method: "GET",
                    url: env.API_ADDRESS + "experience"
                }
            }
        );
    }
]);
