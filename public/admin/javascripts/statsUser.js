$(document).ready(function() {

	$(function() {
		
		// 방문자수, 가입, 탈퇴 
		$("#viewType").bind("change", function() {
			$(".board_list2 > table").hide();
			var id = $(this).val();
			$("#"+id).show();
		});
		
		//달력 클릭
		$("#startDate").bind("click", function(){
			Calendar_Create("startDate");
		});
		$("#endDate").bind("click", function(){
			Calendar_Create("endDate");
		});
		
		// 검색
		$("#btnSearch").bind("click", function() {
			$("#visitSearchForm").submit();
		});
		
		// 유형별 검색
		$("#btnTypeSearch").bind("click", function() {
			$("#visitSearchForm").submit();
		});
		
		// 엑셀저장
		$("#btnVisitExcel").bind("click", function() {
			var startDate = $("#startDate").val();
			var endDate = $("#endDate").val();
			var type = $("#viewType >option:selected").val();
			
			window.location.href="/admin/stats/visitexcel?startDate="+startDate+"&endDate="+endDate+"&type"+type;			
		});

	});
	
});