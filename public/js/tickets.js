var selectedSeats = [];

$(document).ready(function () {
    var leftSeatMap = $('#leftSeatMap').seatCharts({
        map: [
            '__aaaaaaaaaaaaaaaaa',
            'aaaaaaaaaaaaaaaaaaa',
            '_aaaaaaaaaaaaaaaaaa',
            '_aaaaaaaaaaaaaaaaaa',
            '_aaaaaaaaaaaaaaaaaa',
            '_aaaaaaaaaaaaaaaaaa',
            '_aaaaaaaaaaaaaaaaaa',
            '_aaaaaaaaaaaaaaaaaa',
            '_aaaaaaaaaaaaaaaaaa',
            '_aaaaaaaaaaaaaaaaaa',
            '_aaaaaaaaaaaaaaaaaa',
            '_aaaaaaaaaaaaaaaaaa',
            '_aaaaaaaaaaaaaaaaaa',
            '__aaaaaaaaaaaaaaaaa'
        ],
        naming: {
            columns: ['38', '36', '34', '32', '30', '28', '26', '24', '22', '20', '18', '16', '14', '12', '10', '8', '6', '4', '2'],
            rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N']
        },
        seats: {
            a: {
                price: 5.00,
                classes: 'general'
            }
        },
        click: function () {
            if (this.status() == 'available') {
                // Add to array
                selectedSeats.push(this.node()[0].id);
                // Update counter
                $('#seatnumber').text(selectedSeats.length);
                // Update status
                return 'selected';
            } else if (this.status() == 'selected') {
                // Remove from array
                selectedSeats.splice(selectedSeats.indexOf(this.node()[0].id), 1);
                // Update counter
                $('#seatnumber').text(selectedSeats.length);
                // Update status
                return 'available';
            } else if (this.status() == 'unavailable') {
                return 'unavailable';
            } else {
                return this.style();
            }
        }
    });

    var rightSeatMap = $('#rightSeatMap').seatCharts({
        map: [
            'aaaaaaaaaaaaaaaaa__',
            'aaaaaaaaaaaaaaaaaaa',
            'aaaaaaaaaaaaaaaaaa_',
            'aaaaaaaaaaaaaaaaaa_',
            'aaaaaaaaaaaaaaaaaa_',
            'aaaaaaaaaaaaaaaaaa_',
            'aaaaaaaaaaaaaaaaaa_',
            'aaaaaaaaaaaaaaaaaa_',
            'aaaaaaaaaaaaaaaaaa_',
            'aaaaaaaaaaaaaaaaaa_',
            'aaaaaaaaaaaaaaaaaa_',
            'aaaaaaaaaaaaaaaaaa_',
            'aaaaaaaaaaaaaaaaaa_',
            'aaaaaaaaaaaaaaaaa__'
        ],
        naming: {
            columns: ['2', '4', '6', '8', '10', '12', '14', '16', '18', '20', '22', '24', '26', '28', '30', '32', '34', '36', '38'],
            rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N']
        },
        seats: {
            a: {
                price: 5.00,
                classes: 'general'
            }
        },
        click: function () {
            if (this.status() == 'available') {
                // Add to array
                selectedSeats.push(this.node()[0].id);
                // Update counter
                $('#seatnumber').text(selectedSeats.length);
                // Update status
                return 'selected';
            } else if (this.status() == 'selected') {
                // Remove from array
                selectedSeats.splice(selectedSeats.indexOf(this.node()[0].id), 1);
                // Update counter
                $('#seatnumber').text(selectedSeats.length);
                // Update status
                return 'available';
            } else if (this.status() == 'unavailable') {
                return 'unavailable';
            } else {
                return this.style();
            }
        }
    });
});

/**
 BrainTree Setup
 */
var clientToken = "eyJ2ZXJzaW9uIjoyLCJhdXRob3JpemF0aW9uRmluZ2VycHJpbnQiOiJlNjYyOWUzNTZiNzUwN2VjZTFlNWM5YWQwZDBhOGUzNTQ0YmM1OWRkZTc2YTAzMWU1ZjkzNTI3OGYxMWU0MTIyfGNyZWF0ZWRfYXQ9MjAxNi0wMS0yMVQxNzoyOTowMy4zNDYyNTA3NTcrMDAwMFx1MDAyNm1lcmNoYW50X2lkPTM0OHBrOWNnZjNiZ3l3MmJcdTAwMjZwdWJsaWNfa2V5PTJuMjQ3ZHY4OWJxOXZtcHIiLCJjb25maWdVcmwiOiJodHRwczovL2FwaS5zYW5kYm94LmJyYWludHJlZWdhdGV3YXkuY29tOjQ0My9tZXJjaGFudHMvMzQ4cGs5Y2dmM2JneXcyYi9jbGllbnRfYXBpL3YxL2NvbmZpZ3VyYXRpb24iLCJjaGFsbGVuZ2VzIjpbXSwiZW52aXJvbm1lbnQiOiJzYW5kYm94IiwiY2xpZW50QXBpVXJsIjoiaHR0cHM6Ly9hcGkuc2FuZGJveC5icmFpbnRyZWVnYXRld2F5LmNvbTo0NDMvbWVyY2hhbnRzLzM0OHBrOWNnZjNiZ3l3MmIvY2xpZW50X2FwaSIsImFzc2V0c1VybCI6Imh0dHBzOi8vYXNzZXRzLmJyYWludHJlZWdhdGV3YXkuY29tIiwiYXV0aFVybCI6Imh0dHBzOi8vYXV0aC52ZW5tby5zYW5kYm94LmJyYWludHJlZWdhdGV3YXkuY29tIiwiYW5hbHl0aWNzIjp7InVybCI6Imh0dHBzOi8vY2xpZW50LWFuYWx5dGljcy5zYW5kYm94LmJyYWludHJlZWdhdGV3YXkuY29tIn0sInRocmVlRFNlY3VyZUVuYWJsZWQiOnRydWUsInRocmVlRFNlY3VyZSI6eyJsb29rdXBVcmwiOiJodHRwczovL2FwaS5zYW5kYm94LmJyYWludHJlZWdhdGV3YXkuY29tOjQ0My9tZXJjaGFudHMvMzQ4cGs5Y2dmM2JneXcyYi90aHJlZV9kX3NlY3VyZS9sb29rdXAifSwicGF5cGFsRW5hYmxlZCI6dHJ1ZSwicGF5cGFsIjp7ImRpc3BsYXlOYW1lIjoiQWNtZSBXaWRnZXRzLCBMdGQuIChTYW5kYm94KSIsImNsaWVudElkIjpudWxsLCJwcml2YWN5VXJsIjoiaHR0cDovL2V4YW1wbGUuY29tL3BwIiwidXNlckFncmVlbWVudFVybCI6Imh0dHA6Ly9leGFtcGxlLmNvbS90b3MiLCJiYXNlVXJsIjoiaHR0cHM6Ly9hc3NldHMuYnJhaW50cmVlZ2F0ZXdheS5jb20iLCJhc3NldHNVcmwiOiJodHRwczovL2NoZWNrb3V0LnBheXBhbC5jb20iLCJkaXJlY3RCYXNlVXJsIjpudWxsLCJhbGxvd0h0dHAiOnRydWUsImVudmlyb25tZW50Tm9OZXR3b3JrIjp0cnVlLCJlbnZpcm9ubWVudCI6Im9mZmxpbmUiLCJ1bnZldHRlZE1lcmNoYW50IjpmYWxzZSwiYnJhaW50cmVlQ2xpZW50SWQiOiJtYXN0ZXJjbGllbnQzIiwiYmlsbGluZ0FncmVlbWVudHNFbmFibGVkIjp0cnVlLCJtZXJjaGFudEFjY291bnRJZCI6ImFjbWV3aWRnZXRzbHRkc2FuZGJveCIsImN1cnJlbmN5SXNvQ29kZSI6IlVTRCJ9LCJjb2luYmFzZUVuYWJsZWQiOmZhbHNlLCJtZXJjaGFudElkIjoiMzQ4cGs5Y2dmM2JneXcyYiIsInZlbm1vIjoib2ZmIn0=";

braintree.setup(clientToken, "dropin", {
    container: "payment-form"
});