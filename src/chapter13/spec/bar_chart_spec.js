describe('BarChart', function () {
    var div,
        chart,
        data = [
            {x: 0, y: 0},
            {x: 1, y: 3},
            {x: 2, y: 6}
        ];

    beforeEach(function () {
        div = d3.select('body').append('div');
        chart = BarChart(div);
    });

    afterEach(function () {
        div.remove();
    });

    describe('.data', function () {
        it('should allow setting and retrieve chart data', function () {
            expect(chart.data(data).data()).toBe(data);
        });
    });

    describe('.render', function () {
        describe('svg', function () {
            it('should generate svg', function () {
                chart.render();
                expect(svg()).not.toBeEmpty();
            });

            it('should set default svg height and width', function () {
                chart.render();
                expect(svg().attr('width')).toBe('500');
                expect(svg().attr('height')).toBe('350');
            });

            it('should allow changing svg height and width', function () {
                chart.width(200).height(150).render();
                expect(svg().attr('width')).toBe('200');
                expect(svg().attr('height')).toBe('150');
            });
        });

        describe('chart body', function () {
            it('should create body g', function () {
                chart.render();
                expect(chartBody()).not.toBeEmpty();
            });

            it('should translate to (left, top)', function () {
                chart.render();
                expect(chartBody().attr('transform')).toBe('translate(30,10)')
            });
        });

        describe('bars', function () {
            it('should create 3 svg:rect elements', function () {
                chart.data(data).render();
                expect(bars().size()).toBe(3);
            });

            it('should calculate bar width automatically', function () {
                chart.data(data).width(100).height(100)
                    .render();
                bars().each(function () {
                    expect(d3.select(this).attr('width')).toBe('20');
                });
            });

            it('should map bar x using x-scale', function () {
                chart.data(data).width(100).height(100)
                    .x(d3.scale.linear().domain([0, 3]))
                    .y(d3.scale.linear().domain([0, 6]))
                    .render();

                expect(d3.select(bars()[0][0]).attr('x')).toBe('0');
                expect(d3.select(bars()[0][1]).attr('x')).toBe('20');
                expect(d3.select(bars()[0][2]).attr('x')).toBe('40');
            });
        });
    });

    function svg() {
        return div.select('svg');
    }

    function chartBody() {
        return svg().select('g.body');
    }

    function bars() {
        return chartBody().selectAll('rect.bar');
    }
});