import $ from 'jquery';

$('#get_session').on('click', function () {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        type: "POST",
        url: "/home/session",
        data: {
            id: $('#session').val()
        },
        dataType: 'json',
        success: function (response) {
            try {
                if (response['message'] === 'success') {
                    alert(response['session']);

                }
            } catch (error) {
                console.error(error);
            }
        },
        error: function (response) {
            alert('Error' + response);
        }
    });
});

$('#get_pdf').on('click', function () {
    const id = $('#session').val()
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        method: "GET",
        dataType: "script",
        url: "/home/pdf/"+id+"/yoursession.pdf"
    });
});
