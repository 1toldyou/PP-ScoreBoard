<svelte:head>
	<title>PowerPlay Scoreboard</title>
	<meta name="description" content="better score-board for PowerPlay2022" />
</svelte:head>

<script lang="ts">
	import type {ConeAction} from "$lib/cone-action";
	import type {Pole} from "$lib/pole";
	import {PoleHeight} from "$lib/pole";
	import {Alliance, ConeType} from "../lib/cone";

	let junctions: Pole[][] = [
		[
			{height: PoleHeight.GROUND, xCoordinate: 0, yCoordinate: 0, cones: [], blueConeCount: 0, redConeCount: 0},
			{height: PoleHeight.LOW, xCoordinate: 1, yCoordinate: 0, cones: [], blueConeCount: 0, redConeCount: 0},
			{height: PoleHeight.GROUND, xCoordinate: 2, yCoordinate: 0, cones: [], blueConeCount: 0, redConeCount: 0},
			{height: PoleHeight.LOW, xCoordinate: 3, yCoordinate: 0, cones: [], blueConeCount: 0, redConeCount: 0},
			{height: PoleHeight.GROUND, xCoordinate: 4, yCoordinate: 0, cones: [], blueConeCount: 0, redConeCount: 0},
		],
	];
	let actions: ConeAction[] = [];

	$: {
		console.log("actions", actions);
		// console.log("0, 0: ", junctions[0][0].cones);
	}

	function addConeToPole(xCoordinate: number, yCoordinate: number, color: Alliance): void {
		console.log("addConeToPole", xCoordinate, yCoordinate);
		// for trigger reactivity
		actions = [...actions, {
			cone: {
				category: ConeType.REGULAR,
				color: color,
				xCoordinate: xCoordinate,
				yCoordinate: yCoordinate,
			},
			pole: structuredClone(junctions[yCoordinate][xCoordinate]),
		}];
		updatePole();
	}

	function undoAction(): void {
		console.log("undoAction");
		actions = actions.slice(0, actions.length - 1);
	}

	function updatePole(): void {
		console.log("updatePole");
		actions.forEach((action, i) => {
			// console.log("action i", i);
			// console.log("action.pole.yCoordinate action.pole.xCoordinate", action.pole.yCoordinate, action.pole.xCoordinate)
			let currentPole = structuredClone(junctions[action.pole.yCoordinate][action.pole.xCoordinate]);
			if (action.cone.color === Alliance.BLUE) {
				currentPole.blueConeCount++;
			} else {
				currentPole.redConeCount++;
			}
			// console.log("currentPole.cones before", currentPole.cones);
			// currentPole.cones = [...currentPole.cones, action.cone];
			currentPole.cones.push(action.cone);
			// console.log("currentPole.cones after", currentPole.cones);
			junctions[action.pole.yCoordinate][action.pole.xCoordinate] = currentPole;
		});
	}
</script>

<section>
	{#each junctions as junctionRow, i}
		<div>
			<p>Row: {i}</p>
			{#each junctionRow as pole, j}
				<div class="pole">
					<p>
						Coordinates: {pole.xCoordinate},{pole.yCoordinate} | {j}, {i}
						Height: {PoleHeight[pole.height]} |
						Blue: {pole.blueConeCount}
						Red: {pole.redConeCount}
						{#if pole.cones.length < 0}
							{#each pole.cones as cone}
								<span>{cone.color}</span>
							{/each}
						{/if}
						|
						<button on:click={() => addConeToPole(pole.xCoordinate, pole.yCoordinate, Alliance.BLUE)}>Add Blue</button>
						<button on:click={() => addConeToPole(pole.xCoordinate, pole.yCoordinate, Alliance.RED)}>Add Red</button>
					</p>
				</div>
			{/each}
		</div>
	{/each}

	<button on:click={undoAction}>Undo</button>

	<hr>

	<h2>Recent Actions</h2>
	<table>
		<thead>
			<tr>
				<th>Color</th>
				<th>Coordinates</th>
			</tr>
		</thead>
		<tbody>
			{#each actions as action}
				<tr>
					<td>{Alliance[action.cone.color]}</td>
					<td>{action.cone.xCoordinate},{action.cone.yCoordinate}</td>
				</tr>
			{/each}
	</table>
</section>
