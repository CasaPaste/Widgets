function get_parts(element) {
    let parts = element.querySelectorAll('.part');
    return parts;
}

isVisible = function (element) {
    let rect = element.getBoundingClientRect();
    let viewHeight = window.innerHeight;
    return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
};

function onVisible(element, callback) {
    new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.intersectionRatio > 0) {
                callback(element);
                observer.disconnect();
            }
        });
    }).observe(element);
    if (!callback) return new Promise(r => callback = r);
}

window.onload = function () {
    let charts = document.querySelectorAll('.donut-chart');
    let chart_num = 0;
    charts.forEach(function (chart) {
        chart.id = `donut-chart-${chart_num}`;
        chart_num++;

        let parts = get_parts(chart);
        let part_num = 0;
        let last_end = 0;
        parts.forEach(function (part) {
            part.id = `${chart.id}-part-${part_num}`;
            part_num++;
            let classes = Array.from(part.classList);
            let circleEl = part.querySelector('.circle');
            circleEl.id = `${part.id}-circle`;

            let start = 0;
            let end = 0;

            for (let className of classes) {
                let matchStart = className.match(/^start(\d*)$/);
                if (matchStart) {
                    start = matchStart[1] === "" ? 0 : parseInt(matchStart[1]);
                    break;
                }
            }

            for (let className of classes) {
                let matchEnd = className.match(/^end(\d*)$/);
                if (matchEnd) {
                    end = matchEnd[1] === "" ? 0 : parseInt(matchEnd[1]);
                    break;
                }
            }

            let startAngle = start;
            let endAngle = end;


            part.style.transform = `rotate(${startAngle}deg)`;

            let animationName = `${circleEl.id}-rotate-${startAngle}-${endAngle}`;
            let animation = `@keyframes ${animationName} {
                from {
                    transform: rotate(0deg);
                }
                to {
                    transform: rotate(${endAngle}deg);
                }
            }`;

            let styleSheet = document.styleSheets[0];

            styleSheet.insertRule(`#${part.id} { transform: rotate(${endAngle}deg); }`, styleSheet.cssRules.length);
            styleSheet.insertRule(animation, styleSheet.cssRules.length);
            // circleEl.style.animation = `${animationName} 1s 1 forwards`;
            last_end += endAngle;
            // add event listener to each circle when it comes in to view to add the animation
            if (isVisible(circleEl)) {
                circleEl.style.animation = `${animationName} 1s 1 forwards`;
            } else {
                onVisible(circleEl, function (element) {
                    element.style.animation = `${animationName} 1s 1 forwards`;
                });
            };
        });
    });
};
