import React, { useState } from 'react';
import MenuLateral from '../menuLateral/menuLateral';
import './acompanhamento.css';

const initialColumns = {
	todo: {
		title: 'A fazer',
		items: [
			{ id: 't1', title: 'Contato inicial com visitante' },
			{ id: 't2', title: 'Agendar visita' },
			{ id: 't3', title: 'Enviar mensagem de boas-vindas' }
		]
	},
	doing: {
		title: 'Em andamento',
		items: [
			{ id: 't4', title: 'Acompanhamento semanal' },
			{ id: 't5', title: 'Reunião de discipulado' }
		]
	},
	done: {
		title: 'Concluído',
		items: [
			{ id: 't6', title: 'Cadastro completo' },
			{ id: 't7', title: 'Entrega de materiais' }
		]
	}
};

function Acompanhamento() {
	const [columns, setColumns] = useState(initialColumns);
	const [draggedItem, setDraggedItem] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [showModal, setShowModal] = useState(false);
	const [showViewModal, setShowViewModal] = useState(false);
	const [viewingTask, setViewingTask] = useState(null);
	const [editingTask, setEditingTask] = useState(null);
	const [openMenuId, setOpenMenuId] = useState(null);
	const [newTask, setNewTask] = useState({
		title: '',
		description: '',
		responsible: '',
		date: '',
		column: 'todo'
	});

	const responsaveis = [
		'João Silva',
		'Maria Santos',
		'Pedro Costa',
		'Ana Oliveira',
		'Carlos Ferreira'
	];

	const handleDragStart = (item, fromColumn) => {
		setDraggedItem({ item, fromColumn });
	};

	const handleDrop = (toColumn) => {
		if (!draggedItem) return;
		const { item, fromColumn } = draggedItem;
		if (fromColumn === toColumn) return;

		setColumns((prev) => {
			const sourceItems = prev[fromColumn].items.filter((i) => i.id !== item.id);
			const targetItems = [...prev[toColumn].items, item];

			return {
				...prev,
				[fromColumn]: {
					...prev[fromColumn],
					items: sourceItems
				},
				[toColumn]: {
					...prev[toColumn],
					items: targetItems
				}
			};
		});

		setDraggedItem(null);
	};

	const handleDragOver = (e) => {
		e.preventDefault();
	};

	const filteredItems = (items) =>
		items.filter((item) =>
			item.title.toLowerCase().includes(searchTerm.toLowerCase())
		);

	const handleAddTask = () => {
		if (!newTask.title.trim()) return;

		const newId = `t${Date.now()}`;
		const taskToAdd = {
			id: newId,
			title: newTask.title,
			description: newTask.description,
			responsible: newTask.responsible,
			date: newTask.date
		};

		if (editingTask) {
			// Editando tarefa existente
			setColumns((prev) => {
				const updatedColumns = { ...prev };
				for (const colKey in updatedColumns) {
					updatedColumns[colKey].items = updatedColumns[colKey].items.map((item) =>
						item.id === editingTask.id ? { ...item, ...taskToAdd, id: editingTask.id } : item
					);
				}
				return updatedColumns;
			});
		} else {
			// Adicionando nova tarefa
			setColumns((prev) => ({
				...prev,
				[newTask.column]: {
					...prev[newTask.column],
					items: [...prev[newTask.column].items, taskToAdd]
				}
			}));
		}

		setNewTask({
			title: '',
			description: '',
			responsible: '',
			date: '',
			column: 'todo'
		});
		setEditingTask(null);
		setShowModal(false);
	};

	const handleModalClose = () => {
		setShowModal(false);
		setEditingTask(null);
		setNewTask({
			title: '',
			description: '',
			responsible: '',
			date: '',
			column: 'todo'
		});
	};

	const handleViewTask = (item) => {
		setViewingTask(item);
		setShowViewModal(true);
	};

	const handleCloseViewModal = () => {
		setShowViewModal(false);
		setViewingTask(null);
	};

	const handleEditTask = (item, columnId) => {
		setEditingTask(item);
		setNewTask({
			title: item.title,
			description: item.description || '',
			responsible: item.responsible || '',
			date: item.date || '',
			column: columnId
		});
		setShowModal(true);
		setOpenMenuId(null);
	};

	const handleDeleteTask = (itemId) => {
		if (!window.confirm('Deseja realmente excluir esta tarefa?')) return;
		
		setColumns((prev) => {
			const updatedColumns = { ...prev };
			for (const colKey in updatedColumns) {
				updatedColumns[colKey].items = updatedColumns[colKey].items.filter(
					(item) => item.id !== itemId
				);
			}
			return updatedColumns;
		});
		setOpenMenuId(null);
	};

	const toggleMenu = (itemId) => {
		setOpenMenuId(openMenuId === itemId ? null : itemId);
	};

	return (
		<div className="acompanhamento-container">
			<MenuLateral />
			<div className="acompanhamento-content">
				<header className="acompanhamento-header">
					<h1 className="acompanhamento-title">Acompanhamento</h1>
					<div className="acompanhamento-actions">
						<div className="acompanhamento-search">
							<input
								type="text"
								placeholder="Buscar..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
							<span className="search-icon">🔍</span>
						</div>
						<button className="acompanhamento-add" onClick={() => setShowModal(true)}>Adicionar +</button>
					</div>
				</header>

				<div className="kanban-board">
					{Object.entries(columns).map(([columnId, column]) => (
						<div
							key={columnId}
							className="kanban-column"
							onDragOver={handleDragOver}
							onDrop={() => handleDrop(columnId)}
						>
							<div className="kanban-column-header">
								<h2>{column.title}</h2>
								<span className="kanban-count">{column.items.length}</span>
							</div>
							<div className="kanban-items">
								{filteredItems(column.items).map((item) => (
									<div
										key={item.id}
										className="kanban-card"
										draggable
										onDragStart={() => handleDragStart(item, columnId)}
									>
										<div className="kanban-card-actions">
											<button 
												className="kanban-card-view"
												onClick={() => handleViewTask(item)}
												title="Ver detalhes"
											>
												👁️
											</button>
											<div className="kanban-card-menu">
												<button 
													className="kanban-card-menu-btn"
													onClick={(e) => {
														e.stopPropagation();
														toggleMenu(item.id);
													}}
													title="Mais opções"
												>
													⋮
												</button>
												{openMenuId === item.id && (
													<div className="kanban-menu-dropdown">
														<button 
															onClick={() => handleEditTask(item, columnId)}
															className="menu-option"
														>
															✏️ Editar
														</button>
														<button 
															onClick={() => handleDeleteTask(item.id)}
															className="menu-option delete"
														>
															🗑️ Excluir
														</button>
													</div>
												)}
											</div>
										</div>
										<div className="kanban-card-title">{item.title}</div>
										{item.date && (
											<div className="kanban-card-date">
												📅 {new Date(item.date).toLocaleDateString('pt-BR')}
											</div>
										)}
										{item.responsible && (
											<div className="kanban-card-responsible">
												👤 {item.responsible}
											</div>
										)}
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>

			{showModal && (
				<div className="modal-overlay-acomp" onClick={handleModalClose}>
					<div className="modal-content-acomp" onClick={(e) => e.stopPropagation()}>
						<h2 className="modal-title-acomp">{editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}</h2>

						<div className="form-group-acomp">
							<label className="form-label-acomp">Título da tarefa</label>
							<input
								type="text"
								placeholder="Digite o título..."
								value={newTask.title}
								onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
								className="form-input-acomp"
							/>
						</div>

						<div className="form-group-acomp">
							<label className="form-label-acomp">Descrição</label>
							<textarea
								placeholder="Digite a descrição..."
								value={newTask.description}
								onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
								className="form-textarea-acomp"
								rows="3"
							/>
						</div>

						<div className="form-group-acomp">
							<label className="form-label-acomp">Responsável</label>
							<select
								value={newTask.responsible}
								onChange={(e) => setNewTask({ ...newTask, responsible: e.target.value })}
								className="form-select-acomp"
							>
								<option value="">Selecione um responsável</option>
								{responsaveis.map((resp, idx) => (
									<option key={idx} value={resp}>
										{resp}
									</option>
								))}
							</select>
						</div>

						<div className="form-group-acomp">
							<label className="form-label-acomp">Data</label>
							<input
								type="date"
								value={newTask.date}
								onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
								className="form-input-acomp"
							/>
						</div>

						<div className="form-group-acomp">
							<label className="form-label-acomp">Coluna</label>
							<select
								value={newTask.column}
								onChange={(e) => setNewTask({ ...newTask, column: e.target.value })}
								className="form-select-acomp"
							>
								<option value="todo">A fazer</option>
								<option value="doing">Em andamento</option>
								<option value="done">Concluído</option>
							</select>
						</div>

						<div className="modal-buttons-acomp">
							<button className="btn-salvar-acomp" onClick={handleAddTask}>
								{editingTask ? 'Salvar' : 'Adicionar'}
							</button>
							<button className="btn-fechar-acomp" onClick={handleModalClose}>
								Cancelar
							</button>
						</div>
					</div>
				</div>
			)}

			{showViewModal && viewingTask && (
				<div className="modal-overlay-acomp" onClick={handleCloseViewModal}>
					<div className="modal-content-acomp modal-view" onClick={(e) => e.stopPropagation()}>
						<h2 className="modal-title-acomp">Detalhes da Tarefa</h2>

						<div className="view-group">
							<label className="view-label">Título</label>
							<p className="view-text">{viewingTask.title}</p>
						</div>

						{viewingTask.description && (
							<div className="view-group">
								<label className="view-label">Descrição</label>
								<p className="view-text">{viewingTask.description}</p>
							</div>
						)}

						{viewingTask.responsible && (
							<div className="view-group">
								<label className="view-label">Responsável</label>
								<p className="view-text">👤 {viewingTask.responsible}</p>
							</div>
						)}

						{viewingTask.date && (
							<div className="view-group">
								<label className="view-label">Data</label>
								<p className="view-text">📅 {new Date(viewingTask.date).toLocaleDateString('pt-BR')}</p>
							</div>
						)}

						<div className="modal-buttons-acomp">
							<button className="btn-fechar-acomp" onClick={handleCloseViewModal}>
								Fechar
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default Acompanhamento;
