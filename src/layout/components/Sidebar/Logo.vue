<template>
    <div class="sidebar-logo-container" :class="{'collapse':collapse}" :style="{ }">
        <transition name="sidebarLogoFade">
            <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/index">
                <img v-if="logo" :src="logosmall" class="sidebar-logo-small">
                <h1 v-else class="sidebar-title" :style="{ }">{{ title }} </h1>
            </router-link>
            <router-link v-else key="expand" class="sidebar-logo-link" to="/index">
                <img v-if="logo" :src="logo" class="sidebar-logo">
                <h1 class="sidebar-title" :style="{ }">{{ title }} </h1>
            </router-link>
        </transition>
    </div>
</template>

<script>
import logoImg from "@/assets/logo/logo.png";
import logoImagsmall from "@/assets/logo/logo_small.png";
import variables from "@/assets/styles/variables.scss";

export default {
    name: "SidebarLogo",
    props: {
        collapse: {
            type: Boolean,
            required: true,
        },
    },
    computed: {
        variables() {
            return variables;
        },
    },
    data() {
        return {
            title: "",
            logo: logoImg, //logoImg
            logosmall: logoImagsmall,
        };
    },
};
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
    transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
    opacity: 0;
}

.sidebar-logo-container {
    position: relative;
    width: 100%;
    text-align: center;
    overflow: hidden;
    margin-top: 8px;
    margin-bottom: 27px;

    & .sidebar-logo-link {
        height: 100%;
        width: 100%;

        & .sidebar-logo {
            height: 45px;
            vertical-align: middle;
        }
        & .sidebar-logo-small {
            width: 40px;
            height: 40px;
            vertical-align: middle;
        }
        & .sidebar-title {
            display: inline-block;
            margin: 0;
            color: #fff;
            font-weight: 600;
            line-height: 50px;
            font-size: 14px;
            font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
            vertical-align: middle;
        }
    }

    &.collapse {
        .sidebar-logo {
            margin-right: 0px;
        }
    }
}
</style>
