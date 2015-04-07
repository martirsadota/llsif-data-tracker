function initRequest() {
    $.ajax({
        url: 'cgi-bin/lldatafetch.pl?eid=23&uid=274801&init=1',
        success: function(point) {
            // add series
            chart.addSeries({
				yAxis: 1,
				name: "Rank",
				data: point.ranks
			});
            chart.addSeries({
				yAxis: 0,
				name: "Score",
				data: point.scores
			});
            
            // change title
            chart.setTitle({text: 'Personal Rankings (' + point.last_nick + ')'},{text: point.event_name});
            
            // call the updater after one minute
            setTimeout(requestData, 60000);    
        },
        error: function() {
            // retry after one second
            setTimeout(initRequest, 1000);
        },
        cache: false
    });
}

function requestData() {
    $.ajax({
        url: 'cgi-bin/lldatafetch.pl?eid=23&uid=274801&clen=' + chart.series[0].data.length,
        ifModified: true,
        success: function(point,status) {
			console.log('LLSIF Data Fetcher Script returned status: ' + status);
			if (status == 'success') {
				// add the point
				chart.series[0].addPoint(point.last_rank);
				chart.series[1].addPoint(point.last_score);
				
				// change title
				chart.setTitle({text: 'Personal Rankings (' + point.last_nick + ')'});
			}
            
            // call it again after one minute
            setTimeout(requestData, 60000);    
        },
        error: function() {
            // just call it again after one minute
            setTimeout(requestData, 60000);
        },
        cache: false
    });
}