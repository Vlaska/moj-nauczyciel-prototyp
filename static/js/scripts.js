"use strict";
class Grades {
    constructor(name, type, grades, desc) {
        this.name = name;
        this.type = type;
        this.grades = grades;
        this.desc = desc;
    }
}
let grades = {
    columns: [
        new Grades('Odpowiedź ustna 1', 'oust', ['3', '5', '+3', '+4', '3', '5', '+3'], ''),
        new Grades('Odpowiedź ustna 2', 'oust', [null, '4', null, null, '+2', '5', null], ''),
        new Grades('Odpowiedź ustna 3', 'oust', [null, '=5', null, null, null, null, null], ''),
        new Grades('Sprawdzian 1', 'spr', ['2', '5', '3', '0', '1', '5', '5'], ''),
        new Grades('Sprawdzian 2', 'spr', ['5', '-4', '3', '4', '=2', '5', '4'], ''),
    ],
    names: [
        'Marika Jasina',
        'Damian Kolka',
        'Gaja Lampa',
        'Fabian Rosołek',
        'Adrian Torbus',
        'Iwo Wojczuk',
        'Robert Zięciak',
    ],
};
let final_grade = [null, null, null, null, null, null, null];
let final_grade_proposition = [null, null, null, null, null, null, null];
const MAX_COL = 11;
let last_creted_column = null;
;
let grade_types = {
    spr: {
        name: "Sprawdzian",
        weight: 80
    },
    kar: {
        name: "Kartkówka",
        weight: 30
    },
    oust: {
        name: "Odpowiedź ustna",
        weight: 50
    },
    pdom: {
        name: "Praca domowa",
        weight: 40
    }
};
let used_grade_idxes = {
    spr: 2,
    kar: 0,
    oust: 3,
    pdom: 0
};
function get_rows() {
    return $('#grade-table').get()[0].rows;
}
function init_grades() {
    let grade_container = $('#grades-buttons');
    let to_init = grade_container.children();
    for (let i = 0; i < to_init.length; ++i) {
        $(to_init[i]).on("click", () => {
            set_grade($(to_init[i]));
        });
    }
    $('#selected-grade').on('click', reset_selected_grade);
    let grade_type_select = $('#grade-type');
    for (let i in grade_types) {
        let option = document.createElement('option');
        $(option).attr('value', i).text(grade_types[i].name);
        grade_type_select.append(option);
    }
    // let rows = get_rows();
    // for (let i = 1; i < rows.length; ++i) {
    //     let cells = rows[i].cells;
    //     for (let j = 1; j < cells.length; ++j) {
    //         $(cells[j]).on('click', () => {
    //             operation_on_cell($(cells[j]));
    //         });
    //         cells[j].setAttribute('role', 'button');
    //     }
    // }
}
function reset_selected_grade() {
    let selected_container = $('#selected-grade');
    if (selected_container.html() === "<i class=\"fas fa-mouse-pointer\"></i>") {
        return;
    }
    selected_container.data('pointer', true);
    if (selected_container.data('trash')) {
        selected_container.removeClass('trash');
        selected_container.data('trash', false);
    }
    selected_container.html("<i class=\"fas fa-mouse-pointer\"></i>");
    let t = $('.grade-select-menu-item.selected');
    if (t) {
        t.removeClass('selected');
    }
    $('#empty-grade').addClass('selected');
}
function set_grade(src) {
    let selection = $('#selected-grade');
    if (selection.data('trash') == true) {
        console.log(src.data('trash'));
        if (src.data('trash') == false || src.data('trash') == undefined) {
            selection.removeClass('trash');
            selection.data('trash', false);
            selection.data('selected', src.data('selected'));
            selection.text(src.data('selected'));
            let t = $('.grade-select-menu-item.selected');
            if (t) {
                t.removeClass('selected');
            }
            src.addClass('selected');
        }
    }
    else {
        if (src.data('trash') == true) {
            selection.addClass('trash');
            selection.data('trash', true);
            selection.data('selected', '');
            selection.html('<i class="far fa-trash-alt">');
            let t = $('.grade-select-menu-item.selected');
            if (t) {
                t.removeClass('selected');
            }
        }
        else {
            selection.data('selected', src.data('selected'));
            selection.html(src.data('selected'));
            let t = $('.grade-select-menu-item.selected');
            if (t) {
                t.removeClass('selected');
            }
            src.addClass('selected');
        }
    }
    if (src.data('pointer')) {
        selection.data('pointer', true);
    }
    else {
        selection.data('pointer', false);
    }
}
function table_header_generator() {
    let row = document.createElement('tr');
    $(row).addClass('row');
    let idx = 1;
    row.appendChild(document.createElement('th'));
    for (; idx - 1 < grades["columns"].length; ++idx) {
        let cell = document.createElement('th');
        cell.setAttribute('role', 'button');
        $(cell).text(grades["columns"][idx - 1].name).on('click', () => {
            operation_on_header($(cell));
        });
        row.appendChild(cell);
    }
    for (; idx <= MAX_COL; ++idx) {
        let cell = document.createElement('th');
        cell.setAttribute('role', 'button');
        $(cell).addClass("empty").html('<i class="fas fa-plus"></i>').on('click', () => create_new_column());
        row.appendChild(cell);
    }
    let cell = document.createElement('th');
    $(cell).attr('role', 'button').addClass('final-grade-header').text("Ocena końcowa").on("click", () => {
        $('#average-modal').modal('show');
    });
    row.appendChild(cell);
    return row;
}
function table_row_generator(idx) {
    let row = document.createElement('tr');
    $(row).addClass('row');
    let name_cell = document.createElement('td');
    $(name_cell).text(grades["names"][idx]);
    row.appendChild(name_cell);
    for (let i = 0; i < grades["columns"].length; ++i) {
        let grade = grades["columns"][i].grades[idx];
        let cell = document.createElement('td');
        cell.setAttribute('role', 'button');
        row.appendChild(cell);
        $(cell).on('click', () => {
            operation_on_cell($(cell));
        });
        if (grade == null) {
            continue;
        }
        $(cell).text(grade);
    }
    for (let i = grades.columns.length; i < MAX_COL; ++i) {
        let cell = document.createElement('td');
        cell.setAttribute('role', 'button');
        $(cell).on('click', () => {
            operation_on_cell($(cell));
        });
        row.appendChild(cell);
    }
    let final_grade_cell = document.createElement('td');
    $(final_grade_cell).addClass('final-grade-cell');
    let f_grade = final_grade[idx];
    if (f_grade !== null) {
        $(final_grade_cell).text(f_grade);
    }
    else if ((f_grade = final_grade_proposition[idx]) !== null) {
        $(final_grade_cell).text(f_grade).addClass('proposal');
    }
    row.appendChild(final_grade_cell);
    return row;
}
function create_table() {
    let prev_table = $('#grade-table');
    if (prev_table) {
        prev_table.remove();
    }
    let tab = document.createElement("table");
    $(tab).addClass('grade-table').attr('id', 'grade-table');
    tab.appendChild(table_header_generator());
    $("#table-container").append(tab);
    for (let i = 0; i < grades['names'].length; ++i) {
        tab.appendChild(table_row_generator(i));
    }
}
function finalize_creation_of_new_column(callback) {
    let name = $("#grade-name").val();
    let typeVal = $("#grade-type").val();
    let desc = $("#grade-desc").val();
    if (!validate_column_modal()) {
        return true;
    }
    if (!name) {
        let idx = ++used_grade_idxes[typeVal];
        name = `${grade_types[typeVal].name} ${idx}`;
        $("#grade-name").val(name);
    }
    if (!validate_column_modal()) {
        return true;
    }
    let col_grades = [];
    for (let i = 0; i < grades.names.length; ++i) {
        col_grades.push(null);
    }
    let col = new Grades(name, typeVal, col_grades, desc);
    grades.columns.push(col);
    grades.columns.sort((a, b) => {
        if (a.name == b.name)
            return 0;
        return a.name < b.name ? -1 : 1;
    });
    last_creted_column = grades.columns.indexOf(col);
    if (callback) {
        callback();
    }
    create_table();
    $('#new-column-modal').modal('hide');
    $("#col-done").off('click');
    return false;
}
let already_inserted_new_column = false;
function create_new_column(callback) {
    $("#grade-name").val('').removeClass('is-valid').removeClass('is-invalid');
    $("#grade-type").val(0).removeClass('is-valid').removeClass('is-invalid');
    $("#grade-desc").val('');
    $("#grade-type-feedback").css('display', 'none');
    $("#grade-name-feedback").css('display', 'none');
    $('#new-column-modal-header').text("Dodaj nową kolumnę");
    let modal = $('#new-column-modal');
    modal.modal('show');
    already_inserted_new_column = false;
    function rebind_new_column_submit() {
        $("#col-done").off('click').on('click', () => {
            if (already_inserted_new_column) {
                return;
            }
            if (finalize_creation_of_new_column(callback)) {
                rebind_new_column_submit();
                return;
            }
            already_inserted_new_column = true;
        });
    }
    rebind_new_column_submit();
}
function operation_on_cell(src) {
    let grade = $('#selected-grade');
    let col_idx = src.get()[0].cellIndex;
    let row_idx = src.get()[0].parentElement.rowIndex;
    let rows = get_rows();
    if (grade.data('pointer')) {
    }
    else if (grade.data('trash')) {
        src.text('');
        grades.columns[col_idx].grades[row_idx] = null;
    }
    else {
        let header = $(rows[0].cells[col_idx]);
        if (header.hasClass('empty')) {
            // add prompt asking, if it wants to create new column
            // add new column cration
            $('#add-new-column-modal-button').off('click').on('click', () => {
                $('#add-new-column-modal').modal('hide');
                create_new_column(() => {
                    if (last_creted_column !== null) {
                        let cell = get_rows()[row_idx].cells[last_creted_column];
                        operation_on_cell($(cell));
                        last_creted_column = null;
                    }
                });
            });
            $('#add-new-column-modal').modal('show');
            return;
        }
        src.text(grade.data('selected'));
        grades.columns[col_idx].grades[row_idx] = grade.data('selected');
    }
    // console.log(grade.data('selected'));
    // src.text()
}
function validate_column_modal(col) {
    let i_name = $("#grade-name");
    let i_type = $("#grade-type");
    let type_valid = i_type.val() !== '' && i_type.val() !== null;
    let name_valid = true;
    if (col) {
        if (i_name.val() !== col.name) {
            name_valid = grades.columns.find(e => e.name === i_name.val()) === undefined;
        }
    }
    else {
        name_valid = grades.columns.find(e => e.name === i_name.val()) === undefined;
    }
    if (!type_valid) {
        i_type.addClass('is-invalid');
        i_type.removeClass('is-valid');
        $("#grade-type-feedback").css('display', 'block');
    }
    else {
        i_type.removeClass('is-invalid');
        i_type.addClass('is-valid');
        $("#grade-type-feedback").css('display', 'none');
        if (!name_valid) {
            i_name.addClass('is-invalid');
            i_name.removeClass('is-valid');
            $("#grade-name-feedback").css('display', 'block');
        }
        else {
            i_name.removeClass('is-invalid');
            i_name.addClass('is-valid');
            $("#grade-name-feedback").css('display', 'none');
        }
    }
    return (name_valid && type_valid);
}
function edit_column(header) {
    let col = grades.columns[header.get()[0].cellIndex - 1];
    let i_name = $("#grade-name").val(col.name).removeClass('is-valid').removeClass('is-invalid');
    let i_type = $("#grade-type").val(col.type).removeClass('is-valid').removeClass('is-invalid');
    let i_desc = $("#grade-desc").val(col.desc);
    $('#new-column-modal-header').text("Edytuj kolumnę");
    $("#grade-type-feedback").css('display', 'none');
    $("#grade-name-feedback").css('display', 'none');
    let modal = $('#new-column-modal');
    modal.modal('show');
    let already_changed = false;
    function rebind_edit_column_submit() {
        $("#col-done").off("click").on('click', () => {
            if (already_changed) {
                return;
            }
            if (!validate_column_modal(col)) {
                rebind_edit_column_submit();
                return;
            }
            let name = i_name.val();
            let typeVal = i_type.val();
            if (!name) {
                let idx = ++used_grade_idxes[typeVal];
                name = `${grade_types[typeVal].name} ${idx}`;
                $("#grade-name").val(name);
            }
            if (!validate_column_modal(col)) {
                rebind_edit_column_submit();
                return;
            }
            col.name = i_name.val();
            col.type = i_type.val();
            col.desc = i_desc.val();
            already_changed = true;
            create_table();
            modal.modal('hide');
        });
    }
    rebind_edit_column_submit();
}
function operation_on_header(src) {
    let grade = $('#selected-grade');
    let col_idx = src.get()[0].cellIndex;
    let row_idx = 0;
    let rows = get_rows();
    if (grade.data('pointer')) {
        edit_column(src);
    }
    else if (grade.data('trash')) {
        $('#delete-all-grades-in-col-modal').on('click', () => {
            $('#delete-all-grades-in-col').modal('hide');
            $('#delete-all-grades-in-col-modal').off('click');
            for (let i = 1; i < rows.length; ++i) {
                let cell = $(rows[i].cells[col_idx]);
                cell.text('');
                grades.columns[col_idx - 1].grades[i - 1] = null;
            }
        });
        $('#delete-all-grades-in-col').modal('show');
    }
    else {
        for (let i = 1; i < rows.length; ++i) {
            if (grades.columns[col_idx - 1].grades[i - 1] === null) {
                let cell = $(rows[i].cells[col_idx]);
                cell.text(grade.data('selected'));
                grades.columns[col_idx - 1].grades[i - 1] = grade.data('selected');
            }
        }
    }
}
