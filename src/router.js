import Vue from "vue";
import Router from "vue-router";
import Home from "./pages/Home";
import CreateFund from "./pages/CreateFund";
import DisplayFunds from "./pages/DisplayFunds";
import UpdateFundNAV from "./pages/UpdateFundNAV";

Vue.use(Router);

export default new Router({
    // Make sure the server can handle the history mode
    // If not, set it to hash (or delete the mode)
    // More info here: https://router.vuejs.org/guide/essentials/history-mode.html#example-server-configurations
    mode: "hash",
    routes: [
        {
            path: "/",
            name: "home",
            component: Home
        },
        {
            path: "/", // this is needed because of GH Pages
            name: "ghpages",
            component: Home
        },
        {
            path: "/create",
            name: "create",
            component: CreateFund
        },
        {
            path: "/display",
            name: "display",
            component: DisplayFunds
        },
        {
            path: "/update-nav",
            name: "update-nav",
            component: UpdateFundNAV
        },
    ],
    linkActiveClass: "active"
});
