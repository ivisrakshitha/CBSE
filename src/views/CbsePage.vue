<template>
    <div class="cbse-page">
        <nav class="navbar">
            <router-link to="/" class="nav-logo">
                <IvisLabsLogo />
            </router-link>
            <div class="nav-pulse">PULSE</div>
        </nav>

        <header>
            <h1>CBSE Classes</h1>
            <p>Select a class to get started</p>
        </header>

        <div class="class-container">
            <div v-for="classNum in 10" :key="classNum" class="class-card" :class="{
                'disabled': classNum < 10,
                'animated': animatedCards.includes(classNum),
                'hovered': hoveredCard === classNum
            }" :style="{
                '--index': classNum - 1,
                'z-index': hoveredCard === classNum ? 999 : 11 - classNum
            }" @click="classNum === 10 ? selectClass(classNum) : null" @mouseenter="hoveredCard = classNum"
                @mouseleave="hoveredCard = null">
                <div class="glass-overlay"></div>
                <div class="card-header">
                    <div class="class-header">
                        <h2>Class</h2>
                        <p>Explore curriculum, resources and more</p>
                    </div>
                    <div class="roman-indicator">{{ getRomanNumeral(classNum) }}</div>
                </div>

                <div class="card-body">
                    <div class="class-grade">{{ classNum < 10 ? 'Coming Soon' : classNum }}</div>
                    </div>
                </div>
            </div>
        </div>
</template>

<script>
import IvisLabsLogo from '../components/IvisLabsLogo.vue'

export default {
    name: 'CbsePage',
    components: {
        IvisLabsLogo
    },
    data() {
        return {
            animatedCards: [],
            hoveredCard: null
        }
    },
    mounted() {
        this.animateCards();
    },
    methods: {
        selectClass(classNum) {
            if (classNum === 10) {
                this.$router.push(`/class/${classNum}/subjects`);
            }
        },
        getRomanNumeral(num) {
            const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
            return romanNumerals[num - 1];
        },
        animateCards() {
            for (let i = 0; i < 10; i++) {
                setTimeout(() => {
                    this.animatedCards.push(i + 1);
                }, i * 400); // 400ms delay per card
            }
        }
    }
}
</script>

<style scoped>
.cbse-page {
    max-width: 1600px;
    margin: 0 auto;
    padding: 40px 20px;
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
    min-height: 100vh;
    overflow: hidden;
}

.navbar {
    display: flex;
    align-items: center;
    padding: 10px 15px;
    margin-bottom: 20px;
    border-bottom: 1px solid #2c2c2c;
}

.nav-logo {
    text-decoration: none;
}

.nav-pulse {
    margin-left: 15px;
    font-size: 1.4rem;
    font-weight: 600;
    color: #ffffff;
}

header {
    text-align: center;
    margin-bottom: 60px;
}

header h1 {
    font-size: 3rem;
    color: #17b5b5;
    margin-bottom: 15px;
    font-weight: 700;
}

header p {
    font-size: 1.3rem;
    color: #e0e0e0;
}

.class-container {
    display: flex;
    justify-content: center;
    align-items: center;
    perspective: 1200px;
    min-height: 450px;
    width: 100%;
    position: relative;
}

.class-card {
    position: absolute;
    width: 300px;
    height: 400px;
    border-radius: 20px;
    border: 2px solid rgba(255, 255, 255, 0.15);
    background: rgba(255, 255, 255, 0.05);
    box-shadow:
        0 15px 35px rgba(0, 0, 0, 0.4),
        0 5px 15px rgba(0, 0, 0, 0.3),
        inset 0 1px 2px rgba(255, 255, 255, 0.1),
        inset 0 -1px 2px rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px);
    cursor: pointer;
    transform-style: preserve-3d;
    overflow: hidden;
    left: 28%;
    top: 40%;
    transform:
        translate(calc(-50% + var(--index) * 70px), -50%) rotateY(-40deg) rotateX(5deg) translateZ(calc(var(--index) * -15px));
    animation: fadeSlideUp 0.8s ease-out both;
    animation-delay: calc(var(--index) * 0.1s);
    transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* Glass overlay for enhanced glass effect */
.glass-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0.05) 50%,
            rgba(255, 255, 255, 0.02) 100%);
    border-radius: 18px;
    pointer-events: none;
    z-index: 1;
}

@keyframes fadeSlideUp {
    0% {
        opacity: 0;
        transform:
            translate(calc(-50% + var(--index) * 70px), -30%) rotateY(-40deg) rotateX(5deg) translateZ(calc(var(--index) * -15px));
    }

    100% {
        opacity: 1;
        transform:
            translate(calc(-50% + var(--index) * 70px), -50%) rotateY(-40deg) rotateX(5deg) translateZ(calc(var(--index) * -15px));
    }
}

/* Straight hover effect - no tilt */
.class-card:hover,
.class-card.hovered {
    transform:
        translate(calc(-50% + var(--index) * 70px), -50%) rotateY(0deg) rotateX(0deg) translateZ(100px) scale(1.08);
    z-index: 999 !important;
    box-shadow:
        0 35px 70px rgba(0, 0, 0, 0.6),
        0 15px 35px rgba(23, 181, 181, 0.4),
        0 0 50px rgba(77, 210, 210, 0.5),
        inset 0 2px 4px rgba(255, 255, 255, 0.2),
        inset 0 -2px 4px rgba(255, 255, 255, 0.1);
    border-color: rgba(102, 230, 230, 0.8);
    background: rgba(255, 255, 255, 0.1);
}

/* Enhanced glass header */
.card-header {
    background: linear-gradient(135deg,
            rgba(36, 203, 203, 0.95) 0%,
            rgba(36, 203, 203, 0.85) 100%);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    padding: 25px 30px 20px 30px;
    position: relative;
    border-radius: 17px 17px 0 0;
    height: 120px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    z-index: 2;
    box-shadow:
        inset 0 1px 2px rgba(255, 255, 255, 0.3),
        inset 0 -1px 2px rgba(0, 0, 0, 0.1);
}

.class-header h2 {
    font-size: 2.2rem;
    font-weight: 700;
    margin-bottom: 8px;
    color: #ffffff;
    text-shadow:
        0 2px 4px rgba(0, 0, 0, 0.3),
        0 1px 2px rgba(0, 0, 0, 0.2);
    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
}

.class-header p {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.95);
    line-height: 1.4;
    font-weight: 400;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.roman-indicator {
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    color: #ffffff;
    padding: 10px 15px;
    border-radius: 25px;
    font-size: 1.2rem;
    font-weight: 700;
    border: 2px solid rgba(255, 255, 255, 0.3);
    z-index: 3;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    box-shadow:
        0 4px 8px rgba(0, 0, 0, 0.2),
        inset 0 1px 2px rgba(255, 255, 255, 0.2);
}

/* Enhanced glass card body */
.card-body {
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    padding: 30px;
    height: calc(100% - 120px);
    position: relative;
    display: flex;
    align-items: flex-end;
    justify-content: flex-start;
    border-radius: 0 0 17px 17px;
    z-index: 2;
    box-shadow:
        inset 0 1px 2px rgba(255, 255, 255, 0.1),
        inset 0 -1px 2px rgba(0, 0, 0, 0.1);
}

.class-grade {
    font-size: 1.2rem;
    font-weight: 600;
    color: #ffffff;
    background: rgba(77, 210, 210, 0.25);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    padding: 12px 18px;
    border-radius: 25px;
    border: 2px solid rgba(77, 210, 210, 0.5);
    z-index: 2;
    text-shadow:
        0 0 15px rgba(71, 190, 190, 0.8),
        0 1px 2px rgba(0, 0, 0, 0.3);
    box-shadow:
        0 4px 8px rgba(0, 0, 0, 0.2),
        inset 0 1px 2px rgba(255, 255, 255, 0.2),
        inset 0 -1px 2px rgba(0, 0, 0, 0.1);
}

/* Enhanced disabled cards glass effect */
.class-card.disabled {
    opacity: 0.6;
    cursor: not-allowed;
    filter: grayscale(40%);
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(15px);
    border-color: rgba(255, 255, 255, 0.1);
}

.class-card.disabled .card-header {
    background: linear-gradient(135deg,
            rgba(42, 212, 212, 0.7) 0%,
            rgba(42, 212, 212, 0.6) 100%);
    backdrop-filter: blur(15px);
}

.class-card.disabled .card-body {
    background: rgba(255, 255, 255, 0.02);
    backdrop-filter: blur(15px);
}

.class-card.disabled .class-grade {
    color: rgba(238, 238, 238, 0.8);
    background: rgba(27, 175, 208, 0.15);
    border-color: rgba(136, 136, 136, 0.5);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.class-card.disabled:hover {
    transform:
        translate(calc(-50% + var(--index) * 70px), -50%) rotateY(-40deg) rotateX(5deg) translateZ(calc(var(--index) * -15px));
    box-shadow:
        0 15px 35px rgba(0, 0, 0, 0.3),
        0 5px 15px rgba(23, 181, 181, 0.1),
        inset 0 1px 2px rgba(255, 255, 255, 0.1);
    border-color: rgba(102, 102, 102, 0.3);
    scale: 1;
}

/* Enhanced hover state for enabled cards */
.class-card:not(.disabled):hover .card-header {
    background: linear-gradient(135deg,
            rgba(36, 203, 203, 1) 0%,
            rgba(36, 203, 203, 0.9) 100%);
    box-shadow:
        inset 0 2px 4px rgba(255, 255, 255, 0.4),
        inset 0 -2px 4px rgba(0, 0, 0, 0.1),
        0 0 20px rgba(36, 203, 203, 0.5);
}

.class-card:not(.disabled):hover .card-body {
    background: rgba(255, 255, 255, 0.08);
    box-shadow:
        inset 0 2px 4px rgba(255, 255, 255, 0.15),
        inset 0 -2px 4px rgba(0, 0, 0, 0.1);
}

.class-card:not(.disabled):hover .class-grade {
    background: rgba(77, 210, 210, 0.4);
    border-color: rgba(77, 210, 210, 0.8);
    color: #ffffff;
    text-shadow:
        0 0 20px rgba(71, 190, 190, 1),
        0 1px 2px rgba(0, 0, 0, 0.3);
    box-shadow:
        0 6px 12px rgba(0, 0, 0, 0.3),
        inset 0 2px 4px rgba(255, 255, 255, 0.3),
        inset 0 -2px 4px rgba(0, 0, 0, 0.1),
        0 0 15px rgba(77, 210, 210, 0.6);
}

.class-card:not(.disabled):hover .roman-indicator {
    background: rgba(0, 0, 0, 0.6);
    border-color: rgba(255, 255, 255, 0.5);
    box-shadow:
        0 6px 12px rgba(0, 0, 0, 0.3),
        inset 0 2px 4px rgba(255, 255, 255, 0.3),
        inset 0 -2px 4px rgba(0, 0, 0, 0.1);
}
</style>